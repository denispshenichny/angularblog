import {Component, Input, OnInit} from '@angular/core';
import {IPost} from "../shared/interfaces";
import {ActivatedRoute, Params} from "@angular/router";
import {PostsService} from "../shared/posts.service";
import {switchMap} from "rxjs/operators";
import {Observable} from "rxjs";

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.css']
})
export class PostPageComponent implements OnInit {
  public post$!: Observable<IPost>;

  constructor(private postsService: PostsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.post$ = this.route.params.pipe(
      switchMap((params: Params) => this.postsService.getById(params['id']))
    );
  }
}
