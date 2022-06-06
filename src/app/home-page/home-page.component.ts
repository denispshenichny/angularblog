import { Component, OnInit } from '@angular/core';
import {PostsService} from "../shared/posts.service";
import {Observable, of} from "rxjs";
import {IPost} from "../shared/interfaces";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  public posts$: Observable<IPost[]> = of([]);

  constructor(private postsService: PostsService) { }

  ngOnInit(): void {
    this.posts$ = this.postsService.fetchAll();
  }

}
