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
          _count: {
            select: { likes: true }
          },
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
            likesCount: tweet._count.likes,
            isLiked: currentUserId ? tweet._count.likes > 0 : false,
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
    })

});
