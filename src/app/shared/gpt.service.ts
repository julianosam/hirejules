import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GptService {

  constructor(
    private _http: HttpClient
  ) { }

  async ask(question: string, jobName: string = ''): Promise<string> {

    //return `<div><p>Jules Sanches is a rockstar fit for the Principal Back End Engineer role at Aspira. Here's why:</p><ul><li><strong>Extensive Back-End Experience:</strong> With over 20 years in software engineering, Jules has led complex back-end projects at companies like Snaplogic and ADP.</li><li><strong>Architectural Design:</strong> At ADP, he transformed legacy systems into modern microservices, showcasing his architectural prowess.</li><li><strong>AWS Expertise:</strong> Jules has hands-on experience with AWS services like Lambda, S3, DynamoDB, and CloudFront, aligning perfectly with Aspira's needs.</li><li><strong>Leadership &amp; Mentorship:</strong> He's led teams and mentored engineers, fostering growth and innovation at Snaplogic and Seesaw Learning.</li><li><strong>Testing &amp; Optimization:</strong> Jules is well-versed in TDD and BDD, ensuring robust and efficient back-end solutions.</li><li><strong>Problem-Solving &amp; Adaptability:</strong> His track record at ADP and Instacart shows his ability to tackle challenges and adapt to new technologies.</li></ul><p>Jules' blend of technical skills, leadership, and AWS expertise makes him the ideal candidate to drive Aspira's back-end systems to new heights.</p></div>`;

    const req = this._http.post<any>('https://ghj8bqsdmj.execute-api.us-east-2.amazonaws.com/prod/ask-jules', {
      question,
      jobName
    });


    const res = await firstValueFrom(req);
    const answ = res;
    return answ;

  }

}