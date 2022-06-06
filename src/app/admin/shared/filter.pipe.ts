import {Pipe, PipeTransform} from "@angular/core";
import {IPost} from "../../shared/interfaces";

@Pipe({
  name: 'filterPosts'
})
export class FilterPipe implements PipeTransform {
  transform(posts: IPost[], filterString: string = ''): IPost[] {
    if (!filterString.trim())
      return posts;

    filterString = filterString.toLowerCase();
    return posts.filter((post: IPost) =>
      post.author.toLowerCase().includes(filterString) ||
      post.title.toLowerCase().includes(filterString));
  }
}
