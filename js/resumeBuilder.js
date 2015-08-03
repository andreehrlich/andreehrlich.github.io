/* 4 JSON objects that will fill my resume website*/

var bio = {
	"name": "Andre",
	"role": "Engineer",
	"contacts": {
		"mobile": "xxx-xxx-xxxx",
    	"email": "xxxxxxx2018@u.northwestern.edu",
    	"github": "DoctaDocta",
    	"blog": "none",
    	"location": "Chicago, IL"
	},

	"welcomeMessage": "Hello, thanks for visiting my website!",
	"skills": ["matlab", "python", "html", "css", "javascript"],
	"biopic": "./images/profilepic.jpg"
};

bio.display = function() {
	var formattedHeaderName = HTMLheaderName.replace("%data%", bio.name);
	$("#header").append(formattedHeaderName);

	var formattedHeaderRole = HTMLheaderRole.replace("%data%", bio.role);
	$("#header").append(formattedHeaderRole);

	var formattedMobile = HTMLmobile.replace("%data%", bio.contacts.mobile);
	//$("#topContacts").append(formattedMobile);

	var formattedEmail = HTMLemail.replace("%data%", bio.contacts.email)
	//$(".flex-item:last").append(formattedEmail);

	var formattedGithub = HTMLgithub.replace("%data%", bio.contacts.github);
	//$(".flex-item:last").append(formattedGithub);

	/*
	var formattedBlog = HTMLblog.replace("%data%", bio.contacts.blog);
	$(".flex-item:last").append(formattedBlog);
	*/

	var formattedLocation = HTMLlocation.replace("%data%", bio.contacts.location);
	//$(".flex-item:last").append(formattedLocation);

	var formattedPic = HTMLbioPic.replace("%data%", bio.biopic);
	//$(".flex-item:last").append(formattedPic);

	var formattedWelcome = HTMLwelcomeMsg.replace("%data%", bio.welcomeMsg);
	//$(".flex-item:last").append(formattedWelcome);
	
	$("#header").prepend(formattedPic);
	$("#topContacts").append(formattedMobile).append(formattedEmail).append(formattedGithub).append(formattedLocation);
	$("#footerContacts").append(formattedMobile).append(formattedEmail).append(formattedGithub);


	if(bio.skills.length > 0){
		$("#header").append(HTMLskillsStart);

		/* attempted to loop through skills... not successful haha
		$.each(bio.skills, function(index) {
			var formattedSkill = HTMLskills.replace("%data", index);
		};
		*/
		
		var formattedSkill = HTMLskills.replace("%data%", bio.skills[0]);
		$("#skills").append(formattedSkill);	
		var formattedSkill = HTMLskills.replace("%data%", bio.skills[1]);
		$("#skills").append(formattedSkill);	
		var formattedSkill = HTMLskills.replace("%data%", bio.skills[2]);
		$("#skills").append(formattedSkill);	
		var formattedSkill = HTMLskills.replace("%data%", bio.skills[3]);
		$("#skills").append(formattedSkill);	
		var formattedSkill = HTMLskills.replace("%data%", bio.skills[4]);
		$("#skills").append(formattedSkill);	

		};

}

var education = {
	"schools": {
		"name": "Northwestern University",
		"location": "Evanston, IL",
		"degree": "Bachelor of Science",
		"majors": "Computer Engineering",
		"dates": 2018,
		"url": "http://www.northwestern.edu"
	},
	"onlineCourses": {
		"title": "Front-end Web Developer Nanodegree",
		"school": "Udacity",
		"dates": 2018,
		"url": "udacity.com"
	},
};

education.display = function() {

	var formattedschoolStart = HTMLschoolStart;
	$("#education").append(formattedschoolStart);

	var formattedschoolName = HTMLschoolName.replace("#", "http://www.northwestern.edu").replace("%data%", education.schools.name);
	$(".education-entry").append(formattedschoolName);

	var formattedschoolDegree = HTMLschoolDegree.replace("%data%", education.schools.degree);
	$(".education-entry").append(formattedschoolDegree);

	var formattedschoolDates = HTMLschoolDates.replace("%data%", education.schools.dates);
	$(".education-entry").append(formattedschoolDates);

	var formattedschoolLocation = HTMLschoolLocation.replace("%data%", education.schools.location);
	$(".education-entry").append(formattedschoolLocation);

	var formattedschoolMajor = HTMLschoolMajor.replace("%data%", education.schools.majors);
	$(".education-entry").append(formattedschoolMajor);

/* below this is Udacity Information. Above this is university info.*/
};


var work = {
	"jobs": {
			"employer": "http://www.riverratssailing.org/",
			"title": "Sailing Instructor",
			"location": "Fair Haven, NJ",
			"dates": "June-Aug, 2013 and 2014",
			"description": "Worked with a team"
	},
};

work.display = function() {

	var formattedWorkStart = HTMLworkStart;
	$("#workExperience").append(formattedWorkStart);

	var formattedworkEmployer = HTMLworkEmployer.replace("#", work.jobs.employer).replace("%data%", "River Rats");
	$(".work-entry").append(formattedworkEmployer);

	var formattedworkTitle = HTMLworkTitle.replace("%data%", work.jobs.title);
	$(".work-entry").append(formattedworkTitle);

	var formattedworkDates = HTMLworkDates.replace("%data%", work.jobs.dates);
	$(".work-entry").append(formattedworkDates);

	var formattedworkLocation = HTMLworkLocation.replace("%data%", work.jobs.location);
	$(".work-entry").append(formattedworkLocation);

	var formattedworkDescription = HTMLworkDescription.replace("%data%", work.jobs.description);
	$(".work-entry").append(formattedworkDescription);

};

var projects = {
	"title": "iTunes Album Artwork",
	"dates": "July 2015",
	"description": "Python script reads iTunes XML, performs a google search query, and embeds images into mp3 that itunes can read."
};

projects.display = function () {

	var formattedprojectStart = HTMLprojectStart;
	$("#projects").append(formattedprojectStart);

	var formattedprojectTitle = HTMLprojectTitle.replace("#","https://github.com/DoctaDocta/itunes-art-py").replace("%data%", projects.title);
	$(".project-entry").append(formattedprojectTitle);

	var formattedprojectData = HTMLprojectDates.replace("%data%", projects.dates);
	$(".project-entry").append(formattedprojectData);

	var formattedprojectDescription = HTMLprojectDescription.replace("%data%", projects.description);
	$(".project-entry").append(formattedprojectDescription);


};

bio.display()
work.display()
education.display()
projects.display()


/* Map stuff	*/
$("#map").append(googleMap);



