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
  { rollNo: '2101011', name: 'Aman Sinha', branch: 'ME', mobile: '9973348061', email: 'amans.ug21.me@nitp.ac.in' },
  { rollNo: '2101013', name: 'Karra Rohith', branch: 'ME', mobile: '7842865464', email: 'karrar.ug21.me@nitp.ac.in' },
  { rollNo: '2101131', name: 'Pawni Chauhan', branch: 'ME', mobile: '8756160269', email: 'pawnic.ug21.me@nitp.ac.in' },
  { rollNo: '2102024', name: 'Aditya Manna', branch: 'EE', mobile: '6202642071', email: 'adityamkr.ug21.ee@nitp.ac.in' },
  { rollNo: '2102040', name: 'Vanshika Singh', branch: 'EE', mobile: '8019474177', email: 'vanshikas.ug21.ee@nitp.ac.in' },
  { rollNo: '2102133', name: 'Keshav Kumar Jha', branch: 'EE', mobile: '9661308164', email: 'keshavj.ug21.ee@nitp.ac.in' },
  { rollNo: '2103019', name: 'Pravind Puskar', branch: 'CE', mobile: '7004695641', email: 'pravindp.ug21.ce@nitp.ac.in' },
  { rollNo: '2103027', name: 'Saurav Kumar', branch: 'CE', mobile: '7416934932', email: 'sauravk.ug21.ce@nitp.ac.in' },
  { rollNo: '2103094', name: 'Md Shakir Khan', branch: 'CE', mobile: '8528681868', email: 'mohdk.ug21.ce@nitp.ac.in' },
  { rollNo: '2104120', name: 'Alankrita Singh', branch: 'ECE', mobile: '9569938138', email: 'alankritas.ug21.ec@nitp.ac.in' },
  { rollNo: '2104167', name: 'Rohan Nagraj Shetty', branch: 'ECE', mobile: '8468976192', email: 'rohans.ug21.ec@nitp.ac.in' },
  { rollNo: '2104095', name: 'Aditya Raj', branch: 'ECE', mobile: '7634050440', email: 'Adityar.ug21.ec@nitp.ac.in' },
  { rollNo: '2105027', name: 'Muskan Jha', branch: 'B.Arch', mobile: '9693177540', email: 'muskanj.ug21.ar@nitp.ac.in' },
  { rollNo: '2106008', name: 'Rohini Kumari', branch: 'CSE', mobile: '6299412084', email: 'rohinik.ug21.cs@nitp.ac.in' },
  { rollNo: '2106075', name: 'Rakshit Sinha', branch: 'CSE', mobile: '7980618733', email: 'rakshits.ug21.cs@nitp.ac.in' },
  { rollNo: '2106084', name: 'Aniket Kumar', branch: 'CSE', mobile: '8271824498', email: 'aniketk.ug21.cs@nitp.ac.in' },
  { rollNo: '2106188', name: 'C Venkata Sumanth', branch: 'CSE', mobile: '7780595030', email: 'chatarasupallis.ug21.cs@nitp.ac.in' },
  { rollNo: '2340005', name: 'Ayush Kumar', branch: 'M.Tech_ECE', mobile: '9572709951', email: 'aayushk.pg23.ec@nitp.ac.in' },
  { rollNo: '2334005', name: 'Vidhina Pranayak', branch: 'M.Tech_ME', mobile: '8298777770', email: 'vidhinap.pg23.me@nitp.ac.in' },
  { rollNo: '2323012', name: 'Amarket Singh', branch: 'M.Tech_CE', mobile: '8806262237', email: 'amarkets.pg23.ce@nitp.ac.in' },
  { rollNo: '2354006', name: 'Anurag Prakash', branch: 'M.Tech_CSE', mobile: '6204394376', email: 'anuragp.pg23.cs@nitp.ac.in' },
]

const supportStaff = [
  { id: 1, name: "Mr. Deepak Kumar", position: "Placement Coordinator Assistant",image: "./deepak.jpg" },
  { id: 2, name: "Mr. Chandan Kumar", position: "Placement Coordinator Assistant",image: "./chandan.jpg" },
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
                name: "Prof. P. K. Jain",
                role: "Director, NIT Patna",
                email:"director@nitp.ac.in",
                image: "https://www.nitp.ac.in/_next/image?url=https%3A%2F%2Fdrive.google.com%2Fthumbnail%3Fauthuser%3D0%26sz%3Dw320%26id%3D1uHLAWL2-T5vA-QeUJyISAqSlRp7kyOeW&w=640&q=75",
                description: "Leading NIT Patna's vision for excellence in technical education and industry collaboration."
              },
              {
                name: " Dr. Ajay Kumar",
                role: "Training & Placement Officer",
                image: "./ajay.jpg",
                email:"placement@nitp.ac.in",
                description: "Leading NIT Patna's vision for excellence in technical education and industry collaboration."
              },
              {
                name: "Dr. Samrat Mukherjee",
                role: "Dean, Student Welfare",
                email:"placement@nitp.ac.in",
                image: "https://www.nitp.ac.in/_next/image?url=https%3A%2F%2Fdrive.google.com%2Fthumbnail%3Fauthuser%3D0%26sz%3Dw320%26id%3D1lZlLuEiNG-dZ9vLED4VGk4gqkRqPNIfz&w=640&q=75",
                description: "Spearheading placement activities and industry relations with over 15 years of experience."
              },
              {
                name: "Dr. Santosh Kumar Tripathy",
                role: "Faculty Coordinator",
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
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text">Student Coordinators</h2>
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
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text">Support Staff</h2>
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
