import { YouTube } from '..'
import { youtube_v3 } from 'googleapis'
import { Playlist } from '.'

/**
 * A YouTube channel.
 */
export class Channel {
  /**
   * The YouTube object that created this channel object.
   */
  public youtube: YouTube

  /**
   * Whether or not this a full channel object or not.
   */
  public full: boolean

  /**
   * The raw data of this channel.
   */
  public data: youtube_v3.Schema$Channel | youtube_v3.Schema$SearchResult

  /**
   * The name of this channel.
   */
  public name: string

  /**
   * The description of this channel.
   */
  public about: string

  /**
   * The ID of this channel.
   */
  public id: string

  /**
   * The country this channel is based in.
   */
  public country: string

  /**
   * The url of the channel.
   */
  public url: string

  /**
   * This channel's custom URL, if they have one.
   */
  public customUrl: string

  /**
   * This channel's profile pictures.
   */
  public profilePictures: youtube_v3.Schema$ThumbnailDetails

  /**
   * The date this channel was created.
   */
  public datePublished: Date

  /**
   * The default language for this channel's uploads.
   */
  public language: string

  /**
   * This channel's view count.
   */
  public views: number

  /**
   * The channel's uploads. Only available after calling `Channel#getVideos()`
   */
  public videos: Playlist

  /**
   * The number of subscribers this channel has. `-1` if the subcount is hidden.
   */
  public subCount: number

  /**
   * This channel's comment count.
   */
  public comments: number

  constructor (youtube: YouTube, data: youtube_v3.Schema$Channel | youtube_v3.Schema$SearchResult) {
    this.youtube = youtube
    this.data = data

    this._init(data)
  }

  private _init (data: youtube_v3.Schema$Channel | youtube_v3.Schema$SearchResult) {

    if (data.kind === 'youtube#channel' && (data as youtube_v3.Schema$Channel).status.isLinked) {
      const channel = data as youtube_v3.Schema$Channel

      this.id = channel.id
      this.country = channel.snippet.country
      this.language = channel.snippet.defaultLanguage
      this.views = Number(channel.statistics.viewCount)
      this.comments = Number(channel.statistics.commentCount)
      if (!channel.statistics.hiddenSubscriberCount) {
        this.subCount = Number(channel.statistics.subscriberCount)
      } else {
        this.subCount = -1
      }
    } else if (data.kind === 'youtube#searchResult') {
      this.id = (data as youtube_v3.Schema$SearchResult).id.channelId
    } else {
      throw new Error(`Invalid channel type: ${data.kind}`)
    }

    this.url = `https://youtube.com/channel/${this.id}`
    this.profilePictures = data.snippet.thumbnails
    this.datePublished = new Date(data.snippet.publishedAt)
    this.name = data.snippet.title
    this.about = data.snippet.description
    this.full = data.kind === 'youtube#channel'
  }

  /**
   * Fetches this channel and reassigns this object to the new channel object.
   * Only useful if `this.full` is false, or if you want updated channel info.
   */
  public async fetch () {
    const channel = await this.youtube.getChannel(this.id)
    return Object.assign(this, channel)
  }

  /**
   * Fetches the channel's videos and assigns them to the `Channel#videos` property.
   */
  public async fetchVideos () {
    if (!((this.data as youtube_v3.Schema$Channel).contentDetails)) {
      await this.fetch()
    }

    const videos = await this.youtube.getPlaylist((this.data as youtube_v3.Schema$Channel).contentDetails.relatedPlaylists.uploads)
    this.videos = videos

    return this.videos
  }
}
