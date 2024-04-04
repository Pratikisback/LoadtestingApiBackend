
            import http from 'k6/http';
            import { sleep } from 'k6';


            export const options = {
                vus: 1,
                duration: '10s',
            };

            export default function () {
              const url = 'https://servicestest.khexports.in/api/Page/GetNewPageList';
                const payload = {"pFactoryID":1,"pSearchString":"","pWhereString":"","pLoggedInUserID":49,"pPageIndex":1,"pPageSize":10};
                let headers = {
                  'Content-Type' :'application/json',
                  'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJBUElTZXJ2aWNlQWNjZXN0b2tlbiIsImp0aSI6ImVmOWRkZmVjLWE5OGEtNDhiYS04MWMxLTU2NTkyMjkyMTQ0NiIsImlhdCI6IjQvNC8yMDI0IDI6MTM6MTMgQU0iLCJJZCI6IjEiLCJVc2VyTmFtZSI6Ik1ETUFkbWluIiwiZXhwIjoxNzEyMjAwMzkzLCJpc3MiOiJBUElBdXRoZW50aWNhdGlvblNlcnZlciIsImF1ZCI6IkFQSUNsaWVudCJ9.yBJGzDzLllSpHPwImI1BGItSWyathJYQ4F7QDs7VED4'
                };
                
                const response = http.post(url, payload, { headers: headers });
                sleep(Math.random() * 3);
            }
        