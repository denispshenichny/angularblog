import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {IPost} from "../../shared/interfaces";
import {PostsService} from "../../shared/posts.service";
import {AlertService} from "../shared/services/alert.service";

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.css']
})
export class CreatePageComponent implements OnInit {
  form!: FormGroup;

  constructor(private postsService: PostsService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      content: new FormControl(null, [Validators.required]),
      author: new FormControl(null, [Validators.required])
    });
  }

  submit() {
    if (this.form.invalid)
      return;

    const post: IPost = {
      title: this.form.value.title,
      content: this.form.value.content,
      author: this.form.value.author,
      date: new Date()
    };
    this.postsService.create(post)
      .subscribe(() => {
        this.form.reset();
        this.alertService.success('Post created');
      });
  }
}
