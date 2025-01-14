import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';


const HIRE_JULES_API_URL = `https://api.julessanches.com/prod/hire-jules`;

@Injectable({
  providedIn: 'root'
})
export class HireJulesApiService {

  constructor(
    private _http: HttpClient
  ) { }

  findJobByName(jobName: string): Promise<JobPosting> {
    const params = new HttpParams().set('action', 'getJob').set('jobName', jobName);
    const req = this._http.get<JobPosting>(`${HIRE_JULES_API_URL}/jobs`, { params });
    return firstValueFrom(req);
  }


  async askGPT(question: string, jobName: string = ''): Promise<string> {

    // const MOCK_RESPONSE = `<div><p>Jules Sanches is a rockstar fit for the Principal Back End Engineer role at Aspira. Here's why:</p><ul><li><strong>Extensive Back-End Experience:</strong> With over 20 years in software engineering, Jules has led complex back-end projects at companies like Snaplogic and ADP.</li><li><strong>Architectural Design:</strong> At ADP, he transformed legacy systems into modern microservices, showcasing his architectural prowess.</li><li><strong>AWS Expertise:</strong> Jules has hands-on experience with AWS services like Lambda, S3, DynamoDB, and CloudFront, aligning perfectly with Aspira's needs.</li><li><strong>Leadership &amp; Mentorship:</strong> He's led teams and mentored engineers, fostering growth and innovation at Snaplogic and Seesaw Learning.</li><li><strong>Testing &amp; Optimization:</strong> Jules is well-versed in TDD and BDD, ensuring robust and efficient back-end solutions.</li><li><strong>Problem-Solving &amp; Adaptability:</strong> His track record at ADP and Instacart shows his ability to tackle challenges and adapt to new technologies.</li></ul><p>Jules' blend of technical skills, leadership, and AWS expertise makes him the ideal candidate to drive Aspira's back-end systems to new heights.</p></div>`;
    // return new Promise((resolve) => setTimeout(() => resolve(MOCK_RESPONSE), 6000));


    let params = new HttpParams().set('question', question);

    if (jobName) {
      params = params.set('jobName', jobName);
    }
    const req = this._http.get<any>(`${HIRE_JULES_API_URL}/assistant`, { params });

    return firstValueFrom(req);


  }

}


interface CandidateProfile {
  experience: string;
  education: string;
  qualities: string[];
}

export interface JobPosting {
  name: string;
  company: string;
  originalUrl: string;
  title: string;
  jobSummary: string;
  hardSkills: string[];
  softSkills: string[];
  candidateProfile: CandidateProfile;
  responsibilities: string[];
  experience: string[];
}
