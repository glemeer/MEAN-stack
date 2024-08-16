import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { Post } from "../model";
import { PostService } from "../posts.service";
import { Subscription } from "rxjs";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-post-list',
  standalone: true,
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
  imports: [MatExpansionModule, RouterLink],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private PostSub: Subscription = new Subscription;

  constructor(public postsService: PostService) {};

  ngOnInit(): void {
    this.postsService.getPosts();
    this.PostSub = this.postsService.getPostUpdateListener().subscribe(
      (posts: Post[]) => {
        this.posts = posts;
  8 })
  }

  ngOnDestroy(): void {
    this.PostSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }
    
}