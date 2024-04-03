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
}

export type LogOpenAICompletionData = {
    request: openai.Chat.Completions.ChatCompletionCreateParamsNonStreaming;
    response: openai.Chat.Completions.ChatCompletion;
    system: string;
    feature?: string;
    user?: string;
}

export type CalibrtrClient = {
    logUsage: (data: LogUsageData) => Promise<void>;
    logOpenAICompletion: (data: LogOpenAICompletionData) => Promise<void>;
}

export type CalibrtrClientOptions = {
    deploymentId: string;
    apiKey: string;
    calibrtrAPIUrl?: string;
}

const url = "https://calibrtr.com/api/v1/deployments/{deploymentId}/logusage";

const logUsageFunc = async (data: LogUsageData,
                            deploymentId: string,
                            apiKey: string,
                            calibrtrAPIUrl: string) => {
    const response = await fetch(calibrtrAPIUrl.replace("{deploymentId}", deploymentId), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
        },
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
                                        feature
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
            };
            return await logUsageFunc(logData, deploymentId, apiKey, usedUrl);
        }
    };
};
