import openai from 'openai';

export type LLMCallLog_ = {
    aiProvider?: string,
    aiModel?: string,
    requestTokens?: number,
    responseTokens?: number,
    request?: any,
    response?: any,
}

export type EmbeddingCallLog_ = {
    aiProvider?: string,
    aiModel?: string,
    requestTokens?: number,
    responseTokens?: number,
    request?: any,
    response?: any,
}

export type TranslationCallLog_ = {
    aiProvider?: string,
    aiModel?: string,
    audioLengthSeconds?: number,
    request?: any,
    response?: any,
}

export type CustomCallLog_ = {
    customMetadata?: any,
    request?: any,
    response?: any,
}

export type LogUsageGenericData_ = {
    system: string;
    feature?: string;
    user?: string;
    duration?: number;
    uniqueAICallId?: string;
    aiCallInitialStartTimestamp? : number
}

export type LLMCallLog = LLMCallLog_ & LogUsageGenericData_;
export type EmbeddingCallLog = EmbeddingCallLog_ & LogUsageGenericData_;
export type TranslationCallLog = TranslationCallLog_ & LogUsageGenericData_;
export type CustomCallLog = CustomCallLog_ & LogUsageGenericData_;

export type LogUsageData = ({type: "llm"} & LLMCallLog) | ({type: "embedding"} & EmbeddingCallLog) | ({type: "translation"} & TranslationCallLog) | ({type: "custom"} & CustomCallLog);

export type LogOpenAICompletionData = {
    request: openai.Chat.Completions.ChatCompletionCreateParamsNonStreaming;
    response: openai.Chat.Completions.ChatCompletion;
    system: string;
    feature?: string;
    user?: string;
    queryDuration?: number;
}

export type CalibrtrClient = {
    logUsage: (data: LogUsageData) => Promise<void>;
    logLLMUsage: (data: LLMCallLog) => Promise<void>;
    logEmbeddingUsage: (data: EmbeddingCallLog) => Promise<void>;
    logTranslationUsage: (data: TranslationCallLog) => Promise<void>;
    logCustomUsage: (data: CustomCallLog) => Promise<void>;
    logOpenAICompletion: (data: LogOpenAICompletionData) => Promise<void>;
}

export type CalibrtrClientOptions = {
    apiKey: string;
    calibrtrAPIUrl?: string;
    deploymentId?: string;
}

const url = "https://calibrtr.com/api/v1/logusage";

const logUsageFunc = async (data: LogUsageData,
                            deploymentId: string | undefined,
                            apiKey: string,
                            calibrtrAPIUrl: string) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("x-api-key", apiKey);
    if(deploymentId) {
        headers.append("x-deployment-id", deploymentId);
    }
    const response = await fetch(calibrtrAPIUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        console.warn(`error while calling logUsage: ${response.status} ${response.statusText}`);
    }
    return;
}

export const createCalibrtrClient = ({deploymentId, apiKey, calibrtrAPIUrl}: CalibrtrClientOptions): CalibrtrClient => {
    const usedUrl = calibrtrAPIUrl || url;
    return {
        logUsage: async (data: LogUsageData) => {
            return await logUsageFunc(data, deploymentId, apiKey, usedUrl);
        },
        logLLMUsage: async (data: LLMCallLog) => {
            return await logUsageFunc({...data, type:"llm"}, deploymentId, apiKey, usedUrl);
        },
        logEmbeddingUsage: async (data: EmbeddingCallLog) => {
            return await logUsageFunc({...data, type:"embedding"}, deploymentId, apiKey, usedUrl);
        },
        logTranslationUsage: async (data: TranslationCallLog) => {
            return await logUsageFunc({...data, type:"translation"}, deploymentId, apiKey, usedUrl);
        },
        logCustomUsage: async (data: CustomCallLog) => {
            return await logUsageFunc({...data, type:"custom"}, deploymentId, apiKey, usedUrl);
        },
        logOpenAICompletion: async ({
                                        request,
                                        response,
                                        system,
                                        feature,
                                        queryDuration
                                    } : LogOpenAICompletionData) => {
            const logData: LLMCallLog = {
                aiProvider: "openai",
                aiModel: request.model,
                system,
                feature,
                requestTokens: response.usage?.prompt_tokens ?? 0,
                responseTokens: response.usage?.completion_tokens ?? 0,
                request,
                response,
                duration: queryDuration,
            };
            return await logUsageFunc({...logData, type:"llm"}, deploymentId, apiKey, usedUrl);
        }
    };
};
