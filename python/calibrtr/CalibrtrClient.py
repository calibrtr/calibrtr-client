import requests
import json

def serialize_completion(completion):
    return {
        "id": completion.id,
        "choices": [
            {
                "finish_reason": choice.finish_reason,
                "index": choice.index,
                "message": {
                    "content": choice.message.content,
                    "role": choice.message.role,
                    "function_call": {
                        "arguments": choice.message.function_call.arguments,
                        "name": choice.message.function_call.name
                    } if choice.message and choice.message.function_call else None
                } if choice.message else None
            } for choice in completion.choices
        ],
        "created": completion.created,
        "model": completion.model,
        "object": completion.object,
        "system_fingerprint": completion.system_fingerprint,
        "usage": {
            "completion_tokens": completion.usage.completion_tokens,
            "prompt_tokens": completion.usage.prompt_tokens,
            "total_tokens": completion.usage.total_tokens
        }
    }

class CalibrtrClient:

    def __init__(self,
                 api_key : str,
                 deployment_id : str = None,
                 calibrtr_url : str ="https://calibrtr.com/api/v1/logusage"):
        self.deployment_id = deployment_id
        self.api_key = api_key
        self.calibrtr_url = calibrtr_url

    def log_llm_usage(self,
                  ai_provider : str,
                  ai_model : str,
                  system : str,
                  request_tokens : int,
                  response_tokens : int,
                  feature : str = None,
                  user : str = None,
                  request : any = None,
                  response : any = None):
        request_json = None
        if request:
            # noinspection PyBroadException
            try:
                request_json = json.loads(json.dumps(request))
            except Exception as e:
                ()

        response_json = None
        if response:
            # noinspection PyBroadException
            try:
                response_json = json.loads(json.dumps(response))
            except Exception as e:
                # noinspection PyBroadException
                try:
                    response_json = json.loads(json.dumps(serialize_completion(response)))
                except Exception as e:
                    ()

        headers = {
            'Content-Type': 'application/json',
            'x-api-key': self.api_key,
            }
        if self.deployment_id is not None:
            headers['x-deployment-id'] = self.deployment_id
        data = {
            "type": "llm",
            "aiProvider": ai_provider,
            "aiModel": ai_model,
            "system": system,
            "requestTokens": request_tokens,
            "responseTokens": response_tokens,
            "feature": feature,
            "user": user,
            "request": request_json,
            "response": response_json
        }
        url = self.calibrtr_url.format(deploymentId=self.deployment_id)
        try:
            response = requests.post(url, headers=headers, json=data)
            if response.status_code != 200:
                print("Error while logging " + response.text)
        except requests.exceptions.RequestException as e:
            print(e)