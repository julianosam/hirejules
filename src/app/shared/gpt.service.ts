import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

const ASSISTANT_URL = `https://j8zfkafq42.execute-api.us-east-2.amazonaws.com/prod/hire-jules/assistant`;


const MOCK_RESPONSE = `<div><p>Jules Sanches is a rockstar fit for the Principal Back End Engineer role at Aspira. Here's why:</p><ul><li><strong>Extensive Back-End Experience:</strong> With over 20 years in software engineering, Jules has led complex back-end projects at companies like Snaplogic and ADP.</li><li><strong>Architectural Design:</strong> At ADP, he transformed legacy systems into modern microservices, showcasing his architectural prowess.</li><li><strong>AWS Expertise:</strong> Jules has hands-on experience with AWS services like Lambda, S3, DynamoDB, and CloudFront, aligning perfectly with Aspira's needs.</li><li><strong>Leadership &amp; Mentorship:</strong> He's led teams and mentored engineers, fostering growth and innovation at Snaplogic and Seesaw Learning.</li><li><strong>Testing &amp; Optimization:</strong> Jules is well-versed in TDD and BDD, ensuring robust and efficient back-end solutions.</li><li><strong>Problem-Solving &amp; Adaptability:</strong> His track record at ADP and Instacart shows his ability to tackle challenges and adapt to new technologies.</li></ul><p>Jules' blend of technical skills, leadership, and AWS expertise makes him the ideal candidate to drive Aspira's back-end systems to new heights.</p></div>`;

@Injectable({
  providedIn: 'root'
})
export class GptService {

  constructor(
    private _http: HttpClient
  ) { }

  async ask(question: string, jobName: string = ''): Promise<string> {

    // return new Promise((resolve) => setTimeout(() => resolve(MOCK_RESPONSE), 6000));


    let params = new HttpParams().set('question', question);

    if (jobName) {
      params = params.set('jobName', jobName);
    }
    const req = this._http.get<any>(ASSISTANT_URL, { params });


    const res = await firstValueFrom(req);
    const answ = res;
    return answ;

  }

}