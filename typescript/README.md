# Calibrtr-Client
Official Client library for calibrtr.com

## Installation
```bash
npm install calibrtr
```

## Usage
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

calibrtrClient.logUsage({
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




