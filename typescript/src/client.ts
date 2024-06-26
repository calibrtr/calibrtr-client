import openai from 'openai';

export type LogUsageData = {
    aiProvider: string;
    aiModel: string;
    system: string;
    requestTokens: number;
    responseTokens: number;
    feature?: string;
    user?: string;
    request?: any;
    response?: any;
    queryDuration?: number;
}

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
        logOpenAICompletion: async ({
                                        request,
                                        response,
                                        system,
                                        feature,
                                        queryDuration
                                    } : LogOpenAICompletionData) => {
            const logData: LogUsageData = {
                aiProvider: "openai",
                aiModel: request.model,
                system,
                feature,
                requestTokens: response.usage?.prompt_tokens ?? 0,
                responseTokens: response.usage?.completion_tokens ?? 0,
                request,
                response,
                queryDuration
            };
            return await logUsageFunc(logData, deploymentId, apiKey, usedUrl);
        }
    };
};
