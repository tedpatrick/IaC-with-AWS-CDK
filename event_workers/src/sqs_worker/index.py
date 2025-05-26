import json

def handler(event, context):

    for record in event['Records']:

        # parse eventbridge event get body
        body = json.loads(record['body'])

        # print detail-type and detail
        print(body.get('detail-type'))
        print(body.get('detail'))