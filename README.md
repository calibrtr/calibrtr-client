# Calibrtr-Client
Official Client library for calibrtr.com


## Python
### Installation
```bash
pip install calibrtr
```
### Usage
```python
from calibrtr import CalibrtrClient
from openai import OpenAI

openAiClient = OpenAI()

calibrtrClient = CalibrtrClient("API_KEY")

chat_completion = openAiClient.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "hello world",
        }
    ],
    model="gpt-3.5-turbo",
)

calibrtrClient.log_llm_usage("openai",
                "gpt-3-turbo", 
                "test",
                chat_completion.usage.prompt_tokens,
                chat_completion.usage.completion_tokens,
                feature="python-client",
                response=chat_completion
                )
```

## JavaScript/TypeScript
### Installation
```bash
npm install calibrtr
```

### Usage
```javascript
import { createCalibrtrClient } from 'calibrtr';
import { OpenAI } from 'openai';

const calibrtrClient = createCalibrtrClient({
    apiKey: "[CALIBRTR_API_KEY]",
});

const openAiClient = new OpenAI();

const request = {
    model: "gpt-3.5-turbo",
    messages: [
        {
            role: "user",
            content: "message",
        }
    ],
};

const chatCompletion = await openAiClient.chat.completions.create(request);

calibrtrClient.logLLMUsage({
        aiProvider: "openai",
        aiModel: "gpt-3-turbo",
        system: "test",
        feature: "js-client",
        requestTokens: chatCompletion.requestTokens,
        responseTokens: chatCompletion.responseTokens,
        request: request,
        response: chatCompletion.choices[0].message,
    }
);
```

## Other Languages (Rest API)

### URL
```
https://api.calibrtr.com/v1/logusage
```

### Headers
```
Content-Type: application/json
x-api-key: [CALIBRTR_API_KEY]
``` 

### Body
```json
{
    "type": "llm",
    "aiProvider": "openai",
    "aiModel": "gpt-3-turbo",
    "system": "test",
    "feature": "rest-api",
    "requestTokens": 100,
    "responseTokens": 100,
    "request": {
        "model": "gpt-3.5-turbo",
        "messages": [
            {
                "role": "user",
                "content": "message"
            }
        ]
    },
    "response": {
        "choices": [
            {
                "message": "response"
            }
        ]
    }
}
```

### Example (.NET)
```csharp
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

class Program
{
    private static readonly string apiKey = "[CALIBRTR_API_KEY]"; // Replace with your actual API key
    private static readonly string apiUrl = "https://api.calibrtr.com/v1/logusage";

    static async Task Main(string[] args)
    {
        var requestBody = new
        {
            type = "llm",
            aiProvider = "openai",
            aiModel = "gpt-3-turbo",
            system = "test",
            feature = "rest-api",
            requestTokens = 100,
            responseTokens = 100,
            request = new
            {
                model = "gpt-3.5-turbo",
                messages = new[]
                {
                    new
                    {
                        role = "user",
                        content = "message"
                    }
                }
            },
            response = new
            {
                choices = new[]
                {
                    new
                    {
                        message = "response"
                    }
                }
            }
        };

        var json = Newtonsoft.Json.JsonConvert.SerializeObject(requestBody);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

        using (var httpClient = new HttpClient())
        {
            httpClient.DefaultRequestHeaders.Add("x-api-key", apiKey);

            await httpClient.PostAsync(apiUrl, httpContent);   
        }
    }
}
```


