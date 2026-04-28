import { router, publicProcedure } from './trpc';
import { zfd } from 'zod-form-data';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const appRouter = router({
  uploadFile: publicProcedure
    .input(
      zfd.formData({
        file: zfd.file(),
      })
    )
    .mutation(async ({ input }) => {
      const { file } = input;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      // Ensure directory exists (redundant if already created but good practice)
      await mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);

      return {
        url: `/uploads/${fileName}`,
      };
    }),
});

export type AppRouter = typeof appRouter;
