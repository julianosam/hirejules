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

    // return new Promise((resolve) => setTimeout(() => resolve({"id":"zynga-principal-software-engineer-server-hit-it-rich","company":"Zynga","title":"Principal Software Engineer (Server) - Hit It Rich!","originalUrl":"https://job-boards.greenhouse.io/zyngacareers/jobs/5398979004?gh_src=503a64f04us","jobSummary":"Zynga is seeking a Principal Software Engineer to join the Hit It Rich! team. This role involves defining, architecting, and developing server-side features and gameplay functionality, integrating new technologies, optimizing code for high-performance simulations, and mentoring other engineers.","responsibilities":["Define, architect, and develop features and gameplay functionality in PHP.","Develop and integrate new technologies and tools, working with content teams.","Dive into the internals of core systems to extend them as needed.","Proactively optimize code and memory for high-performance simulations with tight constraints.","Scope out large tasks and systems with minimal direction, and help with delegation of that work.","Work closely with other engineers to lead multi-week or month-long efforts.","Give team and/or divisional tech talks on architectures that you've built.","Identify and help to improve team and process inefficiencies.","Mentor other engineers."],"requirements":["B.Sc. in Computer Science, Engineering, or equivalent education/work experience.","6+ years of backend software development experience.","Expert knowledge in PHP or a similar programming language.","Experience with cloud computing, preferably AWS.","Solid foundation in data structures, algorithms, and software methodologies.","Excellent communication skills and comfort working in a collaborative environment."],"technologies":["PHP","AWS","Cloud computing","Data structures","Algorithms","Software methodologies"],"softSkills":["Communication","Collaboration","Mentoring","Problem-solving","Leadership"],"hardSkills":["Backend software development","System architecture design","Code optimization","High-performance simulations","Task scoping and delegation"]}), 1000));


    const params = new HttpParams().set('action', 'getJob').set('jobName', jobName);
    const req = this._http.get<JobPosting>(`${HIRE_JULES_API_URL}/jobs`, { params });
    return firstValueFrom(req);
  }


  async askGPT(question: string, jobName: string = ''): Promise<string> {

    // const MOCK_RESPONSE = `<div><p>Jules Sanches is a rockstar fit for the Principal Back End Engineer role at Aspira. Here's why:</p><ul><li><strong>Extensive Back-End Experience:</strong> With over 20 years in software engineering, Jules has led complex back-end projects at companies like Snaplogic and ADP.</li><li><strong>Architectural Design:</strong> At ADP, he transformed legacy systems into modern microservices, showcasing his architectural prowess.</li><li><strong>AWS Expertise:</strong> Jules has hands-on experience with AWS services like Lambda, S3, DynamoDB, and CloudFront, aligning perfectly with Aspira's needs.</li><li><strong>Leadership &amp; Mentorship:</strong> He's led teams and mentored engineers, fostering growth and innovation at Snaplogic and Seesaw Learning.</li><li><strong>Testing &amp; Optimization:</strong> Jules is well-versed in TDD and BDD, ensuring robust and efficient back-end solutions.</li><li><strong>Problem-Solving &amp; Adaptability:</strong> His track record at ADP and Instacart shows his ability to tackle challenges and adapt to new technologies.</li></ul><p>Jules' blend of technical skills, leadership, and AWS expertise makes him the ideal candidate to drive Aspira's back-end systems to new heights.</p><div class="prompts"><a class="prompt">Prompt</a><a class="prompt">Prompt</a><a class="prompt">Prompt</a></div></div>`;
    // return new Promise((resolve) => setTimeout(() => resolve(MOCK_RESPONSE), 6000));


    let params = new HttpParams().set('question', question);

    if (jobName) {
      params = params.set('jobName', jobName);
    }
    const req = this._http.get<any>(`${HIRE_JULES_API_URL}/assistant`, { params });

    return firstValueFrom(req);


  }

}


export interface JobPosting {
  id: string;
  company: string;
  title: string;
  originalUrl: string;
  jobSummary: string;
  responsibilities: string[];
  requirements: string[];
  technologies: string[];
  softSkills: string[];
  hardSkills: string[];
}
