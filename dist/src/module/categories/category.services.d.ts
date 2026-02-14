type CreateCategoryPayload = {
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
};
export declare const categoryServices: {
    getAllCategories: () => Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        icon: string | null;
        isActive: boolean;
    }[]>;
    createCategory: (payload: CreateCategoryPayload) => Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        icon: string | null;
        isActive: boolean;
    }>;
};
export {};
//# sourceMappingURL=category.services.d.ts.map