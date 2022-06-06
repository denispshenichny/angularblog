import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {PostsService} from "../../shared/posts.service";
import {switchMap} from "rxjs/operators";
import {IPost} from "../../shared/interfaces";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent implements OnInit, OnDestroy {
  public form!: FormGroup;
  public isSubmitted: boolean = false;
  private post!: IPost;
  private updateSubscription!: Subscription;

  constructor(private route: ActivatedRoute, private postsService: PostsService) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap((params: Params) => this.postsService.getById(params['id']))
    ).subscribe((post: IPost) => {
      this.post = post;
      this.form = new FormGroup({
        title: new FormControl(post.title, Validators.required),
        content: new FormControl(post.content, Validators.required)
      });
    });
  }

  ngOnDestroy(): void {
    if (this.updateSubscription)
      this.updateSubscription.unsubscribe();
  }

  submitPost() {
    if (this.form.invalid)
      return;

    this.isSubmitted = true;
    this.postsService.update({
      ...this.post,
      content: this.form.value.content,
      title: this.form.value.title
    }).subscribe(() => {
      this.isSubmitted = false;
    });
  }
}
