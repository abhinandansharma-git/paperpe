"""
PaperPe Twitter Bot - @paperpe_in
Handles automated posting for build-in-public journey
"""

import tweepy
import os
from dotenv import load_dotenv
from datetime import datetime

# Load credentials
load_dotenv()

def get_client():
    """Get authenticated Twitter client"""
    client = tweepy.Client(
        consumer_key=os.getenv('TWITTER_CONSUMER_KEY'),
        consumer_secret=os.getenv('TWITTER_CONSUMER_SECRET'),
        access_token=os.getenv('TWITTER_ACCESS_TOKEN'),
        access_token_secret=os.getenv('TWITTER_ACCESS_TOKEN_SECRET')
    )
    return client

def post_tweet(text: str, reply_to: str = None):
    """Post a tweet"""
    client = get_client()
    
    if reply_to:
        response = client.create_tweet(text=text, in_reply_to_tweet_id=reply_to)
    else:
        response = client.create_tweet(text=text)
    
    print(f"Tweet posted! ID: {response.data['id']}")
    return response.data['id']

def post_with_media(text: str, media_path: str):
    """Post a tweet with image"""
    # For media upload, we need v1.1 API
    auth = tweepy.OAuthHandler(
        os.getenv('TWITTER_CONSUMER_KEY'),
        os.getenv('TWITTER_CONSUMER_SECRET')
    )
    auth.set_access_token(
        os.getenv('TWITTER_ACCESS_TOKEN'),
        os.getenv('TWITTER_ACCESS_TOKEN_SECRET')
    )
    api = tweepy.API(auth)
    
    # Upload media
    media = api.media_upload(media_path)
    
    # Post tweet with media using v2
    client = get_client()
    response = client.create_tweet(text=text, media_ids=[media.media_id])
    
    print(f"Tweet with media posted! ID: {response.data['id']}")
    return response.data['id']

# Day 0 announcement tweet
DAY_0_TWEET = """Day 0: Building PaperPe 🚀

India's first paper trading platform for MCX & F&O.

Why?
→ Most traders lose money learning
→ No good MCX paper trading exists
→ Zerodha's virtual trading is... meh

Building in public. Every feature, every win, every fail.

Landing page: DONE ✅

#buildinpublic #trading #mcx #fintech"""

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        # Post custom tweet
        tweet_text = " ".join(sys.argv[1:])
        post_tweet(tweet_text)
    else:
        # Post Day 0 announcement
        post_tweet(DAY_0_TWEET)
