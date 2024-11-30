This project aims to develop a School Management System that can be used to automate the school's management.

Requirements:
Database(JDBC, Mysql vb.) Database Driver Database Tables (Tables and relations shown below) Additionally, CustomCumponent Package provides custom swing components such as JButton, JTable, and JLabel to have a more aesthetic appearance.

Program Objects and Relationships
2.1) The main purpose of use of object ‘Person’:

The admin object, Instructor objects and Student objects are subclasses of the Person object.
Polymorphism and inheritance are also used in object-oriented concepts thanks to the Person object. common parameters gathered together in this class.
2.2) The main purpose of use of object Admin

Represents the Admin account.
Admin can add & delete new classes.
Can query all information about School.
Add & Remove students from classes.
Add & Drop lessons to classes.
Delete or Add student and Instructor accounts.
Add & Delete & Update lesson information.
2.3) The main purpose of use of object Instructor:

Represents the Instructor's account.
Display responsible class students.
Add & Remove lesson sessions.
Add & Delete & Query Lesson topic.
Create a Curriculum for responsible lessons.
2.4) The main purpose of use of object Students:

Represents the Student account.
Display class details.
Display lesson sessions
Display lesson topics.
Download sessions
2.5) The main purpose of use of object StudentClass:

Represents a student class
Has many methods about the class such as removeLessonSessions() or remainedSessions()
2.6) The main purpose of using of object Database:

Acts as a controller between database and application.
All database duties happen in this class functions such as Create, Read, Update, and Delete.
2.7) The main purpose of use of object IPage:

It is an interface designed to notify the system that the panel has changed while making changes to the page. Thanks to this interface, the system is informed when a new panel is opened. This interface works like an event.
2.8) The main purpose of use of object CourseSession:

Represents the student lesson sessions

Connects student, instructor, class and lesson objects 2.9) The main purpose of use of object Lesson:

Represents the School Lessons.

Has many methods about the class such as lessonClasses or findTopic.

3. Rules:
Initially, 1 admin, 2 instructors and 2 student accounts are defined in the system by default.
