export type CommercialCompositionConnectionStatus={provider:'canva';connected:boolean;expiresAt?:string;scopes:readonly string[];canvaUserId?:string;updatedAt?:string};

export type StoredCanvaConnection={accessToken:string;refreshToken:string;expiresAt:string;scopes:string[];canvaUserId?:string;canvaTeamId?:string;updatedAt:string};
