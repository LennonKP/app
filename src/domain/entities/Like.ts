export class Like {
  private userId: string;
  private postId: string;
  private createdAt: Date;

  constructor(props: { userId: string; postId: string; createdAt?: Date }) {
    this.userId = props.userId;
    this.postId = props.postId;
    this.createdAt = props.createdAt ?? new Date();
  }

  getUserId() {
    return this.userId;
  }

  getPostId() {
    return this.postId;
  }

  getCreatedAt() {
    return this.createdAt;
  }
}
