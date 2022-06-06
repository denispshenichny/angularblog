import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IFirebaseCreatePostResponse, IPost} from "./interfaces";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class PostsService {
  constructor(private http: HttpClient){}

  public create(post: IPost) : Observable<IPost> {
    return this.http.post<any>(`${environment.dbEndpoint}/posts.json`, post)
      .pipe(map((response : IFirebaseCreatePostResponse) => {
        const p: IPost = {
          ...post,
          id: response.name,
          date: new Date(post.date)
        };
        return p;
      }));
  }
}
