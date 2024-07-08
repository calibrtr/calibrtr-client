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