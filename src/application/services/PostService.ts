import { PostRepository } from "../../domain/repositories/PostRepository";

export default class PostService {
    constructor (
       private postRepository: PostRepository 
    ) {}
}