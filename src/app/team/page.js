import { Card } from '@/components/ui/card'
import { Users, Mail, Phone, Briefcase, GraduationCap } from 'lucide-react'

export const metadata = {
  title: 'Our Team - Training & Placement Cell NIT Patna',
  description: 'Meet the dedicated team behind the Training & Placement Cell at NIT Patna',
}


const branchMap = {
  ME: "Mechanical Engineering",
  EE: "Electrical Engineering",
  CE: "Civil Engineering",
  ECE: "Electronics and Communication Engineering",
  "B.Arch": "Architecture",
  "Arch.": "Architecture",
  CSE: "Computer Science and Engineering",
  MTech_ECE: "M.Tech (ECE)",
  MTech_ME: "M.Tech (ME)",
  MTech_CE: "M.Tech (CE)",
  MTech_CSE: "M.Tech (CSE)",
};


const getFullBranchName = (branchCode) => {
  
  const normalizedCode = branchCode.replace('M.Tech_', 'MTech_');
  return branchMap[normalizedCode] || branchCode;
};


const studentCoordinators = [
  { rollNo: '2206188', name: 'Abhishek Kumar', branch: 'CSE', mobile: '7366907921', email: 'tpc.tnp@nitp.ac.in' },
  { rollNo: '2203048', name: 'Aditya Chandra', branch: 'CE', mobile: '9693229132', email: 'tpc.tnp@nitp.ac.in' },
  { rollNo: '2203049', name: 'Aarsi Kumari', branch: 'CE', mobile: '9155314361', email: 'tpc.tnp@nitp.ac.in' },
  { rollNo: '2204016', name: 'Aishwarya Adak', branch: 'Arch.', mobile: '6296845938', email: 'tpc.tnp@nitp.ac.in' },
  { rollNo: '2204055', name: 'Amit Kumar', branch: 'ECE', mobile: '8617525631', email: 'tpc.tnp@nitp.ac.in' },
  { rollNo: '2206243', name: 'Arpita Dwivedi', branch: 'CSE', mobile: '9450728221', email: 'tpc.tnp@nitp.ac.in' },
  { rollNo: '2201091', name: 'Chanchal Mani Tripathi', branch: 'ME', mobile: '8368678483', email: 'tpc.tnp@nitp.ac.in' },
  { rollNo: '2202010', name: 'Karishma Kothari', branch: 'EE', mobile: '9263009118', email: 'tpc.tnp@nitp.ac.in' },
  { rollNo: '2206051', name: 'Kushagra', branch: 'CSE', mobile: '9110015673', email: 'tpc.tnp@nitp.ac.in' },
  { rollNo: '2424015', name: 'Nishant Kumar Shukla', branch: 'M.Tech_CE', mobile: '9169872336', email: 'tpc.tnp@nitp.ac.in' },
  { rollNo: '2201115', name: 'Piyush Kumar', branch: 'ME', mobile: '7488345261', email: 'tpc.tnp@nitp.ac.in' },
  { rollNo: '2201139', name: 'Preeti Singh', branch: 'ME', mobile: '8303162690', email: 'tpc.tnp@nitp.ac.in' },
  { rollNo: '2205038', name: 'Sanya Pundhir', branch: 'Arch.', mobile: '9520447839', email: 'tpc.tnp@nitp.ac.in' },
  { rollNo: '2454014', name: 'Shashikant Kumar', branch: 'M.Tech_CSE', mobile: '9534656882', email: 'tpc.tnp@nitp.ac.in' },
  { rollNo: '2206303', name: 'Satyam', branch: 'CSE', mobile: '8210962374', email: 'tpc.tnp@nitp.ac.in' },
  { rollNo: '2204018', name: 'Vijay Sharma', branch: 'ECE', mobile: '7627013560', email: 'tpc.tnp@nitp.ac.in' },
  { rollNo: '2202144', name: 'Yash Gupta', branch: 'EE', mobile: '9580132826', email: 'tpc.tnp@nitp.ac.in' },
  { rollNo: '2202055', name: 'Yashvardhan Singh', branch: 'EE', mobile: '8303536289', email: 'tpc.tnp@nitp.ac.in' }
]

const supportStaff = [
  { id: 1, name: "Mr. Deepak Kumar", position: "Assistant",image: "./deepak.jpg" },
  { id: 2, name: "Mr. Chandan Kumar Jha", position: "Assistant",image: "./chandan.jpg" },
  // Add more staff members here if needed
];

export default function TeamPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-background via-red-900/5 to-red-950/10 dark:from-background dark:via-red-900/10 dark:to-red-950/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              <span className="gradient-text">Meet Our Team</span>
            </h1>
            <p className="mt-6 text-base md:text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Dedicated professionals working tirelessly to bridge the gap between academia and industry.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text">Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
               {
                name: "Dr. Samrat Mukherjee",
                role: "Prof Inchrage (T & P)",
                email:"placement@nitp.ac.in",
                image: "https://www.nitp.ac.in/_next/image?url=https%3A%2F%2Fdrive.google.com%2Fthumbnail%3Fauthuser%3D0%26sz%3Dw320%26id%3D1lZlLuEiNG-dZ9vLED4VGk4gqkRqPNIfz&w=640&q=75",
                description: "Spearheading placement activities and industry relations with over 15 years of experience."
              },
              {
                name: "Dr. Chetan Kumar Hirwani",
                role: "Training & Placement Officer (TPO)",
                image: "https://i.postimg.cc/5967xg6n/DSC-3112-4x4x6-copy.jpg",
                email:"placement@nitp.ac.in",
                description: "Leading NIT Patna's vision for excellence in technical education and industry collaboration."
              },
              
            {
                name: " Dr. Ajay Kumar",
                role: "Assistant Prof Inchrage (T & P)",
                image: "./ajay.jpg",
                email:"placement@nitp.ac.in",
                description: "Leading NIT Patna's vision for excellence in technical education and industry collaboration."
              },
           
              {
                name: "Dr. Santosh Kumar Tripathy",
                role: "Assistant Prof Inchrage (T & P)",
                image: "./santosh.jpg",
                email:"placement@nitp.ac.in",
                description: "Leading NIT Patna's vision for excellence in technical education and industry collaboration."
              }
              
            ].map((member, index) => (
              <Card key={index} className="p-6 hover-card bg-gradient-to-br from-background to-red-900/10 dark:from-red-950/20 dark:to-red-900/20">
                <div className="w-32 h-32 rounded-full bg-red-900/10 mx-auto mb-6 flex items-center justify-center">
                  
                  <img src={member.image} alt={member.name} className=" w-32 h-32 rounded-full  text-red-900 dark:text-red-500" /> 
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">{member.name}</h3>
                <p className="text-red-900 dark:text-red-500 text-center text-sm">{member.role}</p>
                <a href={`mailto:${member.email}`} className="text-muted-foreground text-center text-sm">{member.email}</a>
                <p className="text-muted-foreground text-center text-sm">{member.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Coordinators */}
      {/* <section className="py-12 md:py-20 bg-red-950/5 dark:bg-red-950/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text">Faculty Coordinators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="p-6 hover-card">
                <div className="w-16 h-16 rounded-full bg-red-900/10 mx-auto mb-4 flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-red-900 dark:text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">Dr. Faculty Name</h3>
                <p className="text-red-900 dark:text-red-500 text-center text-sm mb-2">Department Name</p>
                <p className="text-muted-foreground text-center text-sm">Branch Coordinator</p>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Student Coordinators */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text">Training & Placement Coordinators (TPCs)</h2>
          <div className="text-center mb-8">
            <p className="text-muted-foreground">
              Selected for the academic session 2025 – 2026
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {studentCoordinators.map((student) => (
              <Card key={student.rollNo} className="p-5 hover-card flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-900/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-red-900 dark:text-red-500" />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-semibold truncate leading-tight">{student.name}</h3>
                    <p className="text-red-900 dark:text-red-500 text-sm leading-tight">{getFullBranchName(student.branch)}</p>
                  </div>
                </div>
                <hr className="border-red-900/10 dark:border-red-500/10 my-3"/>
                <div className="space-y-2 text-sm mt-auto">
                  <a
                    href={`mailto:${student.email}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                    title={`Email ${student.name}`}
                  >
                    <Mail className="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-primary transition-colors" />
                    <span className="truncate">{student.email}</span>
                  </a>
                  <a
                    href={`tel:${student.mobile}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                    title={`Call ${student.name}`}
                  >
                    <Phone className="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-primary transition-colors" />
                    <span>{student.mobile}</span>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Staff */}
      <section className="py-12 md:py-20 bg-red-950/5 dark:bg-red-950/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text">Training & Placement Assistants</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
            {supportStaff.map((staff) => (
              
              <Card key={staff.id} className="p-6 hover-card bg-gradient-to-br from-background to-red-900/10 dark:from-red-950/20 dark:to-red-900/20">
              <div className="w-32 h-32 rounded-full bg-red-900/10 mx-auto mb-6 flex items-center justify-center">
                
                <img src={staff.image} alt={staff.name} className=" w-32 h-32 rounded-full  text-red-900 dark:text-red-500" /> 
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">{staff.name}</h3>
              <p className="text-red-900 dark:text-red-500 text-center text-sm mb-4">{staff.position}</p>
             
            </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
} 
