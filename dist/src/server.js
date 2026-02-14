import app from "./app";
import { prisma } from "./lib/prisma";
const port = process.env.PORT || 5000;
async function main() {
    try {
        await prisma.$connect();
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error('Error during server startup:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}
main();
//# sourceMappingURL=server.js.map