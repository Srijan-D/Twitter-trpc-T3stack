import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const tweetRouter = createTRPCRouter({

  infiniteScroll: publicProcedure
    .input(z.object({
      limit: z.number().optional(),
      cursor: z.object({
        id: z.string(),
        createdAt: z.date()
      }).optional()
    })).query(async ({ input: { limit = 10, cursor }, ctx }) => {

      const currentUserId = ctx.session?.user.id;

      const tweets = await ctx.prisma.tweet.findMany({
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }], //this is all for pagination
        select: {
          id: true,
          content: true,
          createdAt: true,
          _count: { select: { likes: true } },
          likes:
            currentUserId == null ? false : { where: { userId: currentUserId } },
          user: {
            select: { name: true, id: true, image: true }
          }
        }
      })

      let nextCursor: typeof cursor | undefined

      if (tweets.length > limit) {
        const nextTweet = tweets.pop()
        //essential we are retuning next cursor so that we can use it in the next query to get the next set of tweets instead of running from the first set of tweets
        if (nextTweet != null) {
          nextCursor = { id: nextTweet.id, createdAt: nextTweet.createdAt }
        }
      }

      return {
        tweets: tweets.map(tweet => {
          return {
            id: tweet.id,
            content: tweet.content,
            createdAt: tweet.createdAt,
            likeCount: tweet._count.likes,
            likedByMe: tweet.likes?.length > 0,
            user: tweet.user
          }
        }), nextCursor
      }
    }),


  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input: { content }, ctx }) => {
      const tweet = await ctx.prisma.tweet.create({ data: { content, userId: ctx.session?.user.id }, })
      return tweet;
    }),


  toggleLike: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const data = { tweetId: id, userId: ctx.session?.user.id }
      const existingLike = await ctx.prisma.like.findUnique({
        where: { userId_tweetId: data }
      })
      if (existingLike == null) {
        await ctx.prisma.like.create({ data })

        return { addedlike: true }
      }
      else {
        await ctx.prisma.like.delete({ where: { userId_tweetId: data } })
        return { addedlike: false }
      }
    }),

});
