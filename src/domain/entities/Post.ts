import { Like } from "./Like";
import crypto from "crypto";

export class Post {
  private id: string;
  private authorId: string;
  private imageUrl: string;
  private likes: Like[];
  private createdAt: Date;

  constructor(props: { id?: string; authorId: string; imageUrl: string; likes?: Like[]; createdAt?: Date }) {
    this.id = props.id ?? crypto.randomUUID();
    this.authorId = props.authorId;
    this.imageUrl = props.imageUrl;
    this.likes = props.likes ?? [];
    this.createdAt = props.createdAt ?? new Date();
  }

  getId() {
    return this.id;
  }

  getAuthorId() {
    return this.authorId;
  }

  getImageUrl() {
    return this.imageUrl;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getLikes() {
    // return a defensive copy so external code can’t mutate it
    return [...this.likes];
  }

  getLikeCount() {
    return this.likes.length;
  }

  hasLiked(userId: string): boolean {
    return this.likes.some(like => like.getUserId() === userId);
  }

  like(userId: string) {
    if (this.hasLiked(userId)) {
      throw new Error("User already liked this post");
    }
    this.likes.push(new Like({ userId, postId: this.id }));
  }

  unlike(userId: string) {
    if (!this.hasLiked(userId)) {
      throw new Error("User has not liked this post");
    }
    this.likes = this.likes.filter(like => like.getUserId() !== userId);
  }
}
