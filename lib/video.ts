export interface VideoMetadata {
  title: string;
  author_name: string;
}

export interface VideoData {
  id: string;
  title: string;
  author: string;
  publishedAt?: string;
  author_url: string;
}

export interface YoutubeSearchResponseItem {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    publishedAt: string;
  };
}

export interface YoutubeSearchListResponse {
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YoutubeSearchResponseItem[];
}