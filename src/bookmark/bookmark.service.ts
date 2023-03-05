import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  getBookmarks(userId: string) {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  getBookmarkById(userId: string, bookmarkId: number) {
    return this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }

  async createBookmark(userId: string, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });

    return bookmark;
  }

  async editBookmarkById(
    userId: string,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
    // Fetch bookmark by ID from prisma
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    // Check if bookmark belongs to user
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resource denied');

    // Update bookmarks, return prisma's response
    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookmarkById(userId: string, bookmarkId: number) {
    // Fetch bookmark by ID from prisma
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    // Check if bookmark belongs to user
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resource denied');

    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
    
    return;
  }
}
