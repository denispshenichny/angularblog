import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostsService} from "../../shared/posts.service";
import {IPost} from "../../shared/interfaces";
import {Subscription} from "rxjs";
import {AlertService} from "../shared/services/alert.service";

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  public posts: IPost[] = [];
  private postsSubscription!: Subscription;
  private deleteSubscription!: Subscription;
  filterString: string = '';

  constructor(private postsService: PostsService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.postsSubscription = this.postsService.fetchAll()
      .subscribe(posts => this.posts = posts);
  }

  ngOnDestroy(): void {
    if (this.postsSubscription)
      this.postsSubscription.unsubscribe();

    if (this.deleteSubscription)
      this.deleteSubscription.unsubscribe();
  }

  deletePost(post: IPost) {
    this.deleteSubscription = this.postsService.delete(post)
      .subscribe(() => {
        this.posts = this.posts.filter((p: IPost) => p !== post);
        this.alertService.success('Post successfully deleted.');
      });
  }
}
