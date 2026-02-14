export declare const auth: import("better-auth").Auth<{
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    trustedOrigins: string[];
    session: {
        cookieCache: {
            enabled: true;
            maxAge: number;
        };
    };
    advanced: {
        cookiePrefix: string;
        useSecureCookies: boolean;
        sameSite: string;
        crossSubDomainCookies: {
            enabled: true;
        };
        disableCSRFCheck: true;
    };
    user: {
        additionalFields: {
            role: {
                type: "string";
                defaultValue: string;
                input: false;
            };
            phone: {
                type: "string";
                required: false;
            };
            isBanned: {
                type: "boolean";
                required: false;
                defaultValue: false;
            };
            bannedReason: {
                type: "string";
                required: false;
            };
        };
    };
    emailAndPassword: {
        enabled: true;
        autoSignIn: false;
        requireEmailVerification: true;
    };
    emailVerification: {
        sendOnSignUp: true;
        autoSignInAfterVerification: true;
        sendVerificationEmail: ({ user, url, token }: {
            user: import("better-auth").User;
            url: string;
            token: string;
        }, request: Request | undefined) => Promise<void>;
    };
    baseURL: string | undefined;
    socialProviders: {
        google: {
            prompt: "select_account consent";
            accessType: "offline";
            clientId: string;
            clientSecret: string;
        };
    };
}>;
//# sourceMappingURL=auth.d.ts.map