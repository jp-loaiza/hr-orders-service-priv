# hr-orders-service

## Overview

The orders service is responsible for two main things:

1. *CSV generation and uploading:* It fetches orders from commercetools, generates CSVs from them, and uploads the CSVs to a Harry Rosen SFTP server.
2. *Email notifications:* It calls a Harry Rosen endpoint that sends email notifications to the users who placed the orders.

## Monitoring

### CSV generation and uploading

LogDNA alerts are triggered when a CSV cannot be generated from a given order. The likely cause of this is missing information on the order. (See below.) 

You can query commercetools to find all orders for which the orders service has tried but failed to create and upload CSVs:

```
GET /orders?where=custom(fields(sentToOmsStatus%20%3D%20%22FAILURE%22))&sort=createdAt desc
```

Even if the CSV of an order has successfully uploaded to the SFTP server, it might not be processed successfully. The CSVs of orders that have not been processed successfully are in the `/EDOM/errors` folder of the SFTP server.

To learn why the CSV of an order has not been processed successfully:

1. Get the order number from the CSV in the `/EDOM/errors` folder
    - The order number occurs in many places in the CSV. One place to find it is in the third column of the row that starts with `"H"`.
2. Make the following query to JESTA, replacing `<ORDER_NUMBNER>` with the order number:

```
select 
iso.wfe_trans_id 
,iso.process_status 
,iso.rejected_id 
,emt.description 
,iso.email_address 
from 
edom.iei_sales_orders iso 
left outer join edom.e_rejected_messages erm on erm.rejected_id = iso.rejected_id 
left outer join edom.e_message_texts emt on emt.message_id = erm.message_id 
where iso.wfe_trans_id = '<ORDER_NUMBER>'
```

3. In the unlikely event that you get a response to the previous query which indicates that there is a *structural* problem with the CSV, make two more queries to learn what the specific structural problem is:

```
/* GET ORDER JOB ID */
select * from edom.trace_output_table tot where message like '<ORDER_NUMBER>'

/* GET ORDER STRUCTURE ERROR */
select * from edom.trace_output_table tot where job_id = '<JOB_ID_FROM_PREVIOUS_QUERY>'
```

### Email notifications

LogDNA alerts are triggered when the Harry Rosen email notification server responds with an error code. In the past, these errors have been common and intermittent, and didn't require intervention from Myplanet.

## Fixing problems

### CSV generation and uploading

If a CSV for an order could not be generated:
- First, figure out what the problem is. Check the `errorMessage` custom field on the commercetools order. Ths will either say that certain fields were missing, or simply say "Failed to generate CSV for order".
	- If there is a message saying that certain fields were missing, then the Bold plugin probably failed to add these fields to the order (for example, because the plugin was down when the user was checking out).
	- If the message simply says "Failed to generate CSV for order", check the logs in LogDNA for a more informative error message.
	   - This was probably *not* caused by a failure of the Bold plugin.
	   - In the past, we've seen this error when the order was missing a barcode.
- Then fix the problem in one of two ways:
  - Modify the commercetools order (for example, to add the missing fields) and then set its `sentToOmsStatus` to `PENDING`. It then will be automatically re-processed by the orders service.
	  - Note: Be sure that you to not trigger any price or tax re-calculations when you modify the order.
  - Manually generate the CSV locally, making any necessary modifications, and manually upload the CSV to the  `/EDOM/pending` folder of the SFTP server. For record keeping, set the `sentToOmsStatus` of the commercetools order to `SUCCESS`.

## Other documentation

- [Jesta's specifications of the CSV file](https://drive.google.com/file/d/1sNXODBMPy5z8DIF1U0Qns79WhAhDPifQ/view?ths=true)
