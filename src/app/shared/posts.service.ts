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
        return {
          ...post,
          id: response.name,
          date: new Date(post.date)
        };
      }));
  }

  public fetchAll() : Observable<IPost[]> {
    return this.http.get<IPost[]>(`${environment.dbEndpoint}/posts.json`)
      .pipe(
        map((response: {[key: string] : any}) => {
          return response ? Object.keys(response)
            .map(key => ({
              ...response[key],
              id: key,
              date: new Date(response[key].date)
            })) : [];
        })
      );
  }

  public delete(post: IPost) : Observable<void> {
    return this.http.delete<void>(`${environment.dbEndpoint}/posts/${post.id}.json`);
  }

  public getById(id: string) : Observable<IPost> {
    return this.http.get<IPost>(`${environment.dbEndpoint}/posts/${id}.json`)
      .pipe(map((post: IPost) => {
        return {
          ...post,
          id,
          date: new Date(post.date)
        };
      }));
  }

  public update(post: IPost) : Observable<IPost> {
    return this.http.patch<IPost>(`${environment.dbEndpoint}/posts/${post.id}.json`, post);
  }
}
