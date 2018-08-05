"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A YouTube video.
 */
class Video {
    constructor(youtube, data) {
        this.youtube = youtube;
        this.data = data;
        this._init(data);
    }
    _init(data) {
        if (data.kind === 'youtube#video') {
            const video = data;
            this.id = video.id;
            this.length = video.contentDetails.duration;
            this.minutes = parseInt(this.length.substring(this.length.indexOf('PT') + 2, this.length.indexOf('M')));
            this.seconds = parseInt(this.length.substring(this.length.indexOf('M') + 1, this.length.length - 1));
        }
        else if (data.kind === 'youtube#playlistItem') {
            this.id = data.snippet.resourceId.videoId;
        }
        else if (data.kind === 'youtube#searchResult') {
            this.id = data.id.videoId;
        }
        else {
            throw new Error(`Invalid video type: ${data.kind}.`);
        }
        this.title = data.snippet.title;
        this.description = data.snippet.description;
        this.thumbnails = data.snippet.thumbnails;
        this.datePublished = new Date(data.snippet.publishedAt);
        this.channelId = data.snippet.channelId;
        this.full = data.kind === 'youtube#video';
        this.url = `https://youtube.com/watch?v=${this.id}`;
        this.shortUrl = `https://youtu.be/${this.id}`;
    }
    /**
     * Fetches this video and reassigns this object to the new video object.
     * Only useful if `this.full` is false, or if you want updated video info.
     */
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            const video = yield this.youtube.getVideo(this.id);
            return Object.assign(this, video);
        });
    }
}
exports.Video = Video;
//# sourceMappingURL=Video.js.map