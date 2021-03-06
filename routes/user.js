var passwordHash = require('password-hash');

//---------------------------------------------signup (addstudent submit) page call------------------------------------------------------
exports.signup = function (req, res) {
    var message = '';
    if (req.method == "POST") {

        var post = req.body;
        var fname = post.first_name;
        var mname = post.middle_name;
        var lname = post.last_name;
        var pass = post.password;
        var hashedPassword = passwordHash.generate(pass);
        var gender = post.gender;
        var email = post.email;
        var mob = post.contact_no;
        var school = post.school;
        var grade = post.grade;
        var imageurl = post.image;
        var dob = post.dob;
        var cancelFlag = post.cancelFlag;

        var studentId = 0;
        if (cancelFlag === 'Y') {
            res.redirect('/home/admin_studentlist');
        } else {
            var sql = "INSERT INTO `student`(`studentId`, `first_name`, `last_name`, `middle_name`, `mobile`, `username`, `pass`, `gender`,`school`, `grade`, `dob`, `image_url`) VALUES ('" + studentId + "','" + fname + "','" + lname + "','" + mname + "','" + mob + "','" + email + "','" + hashedPassword + "','" + gender + "','" + school + "','" + grade + "','" + dob + "','" + imageurl + "')";

            db.query(sql, (err, data) => {
                if (err) throw err;
                console.log("Inside signup");
                //console.log(data);
                message = `Kindly enter student details for student - '${fname} ${lname}'.`;
                res.render('addstudentdetails.ejs', {
                    message: message
                });
                //res.redirect('/home/admin_studentlist');
            });
        }

    } else {
        res.render('addstudent.ejs');
    }
};

//---------------------------------------------submit student details page call------------------------------------------------------
exports.addstudentdetails = function (req, res) {
    var message = '';
    if (req.method == "POST") {

        var post = req.body;
        var username = post.email;
        var street = post.street;
        var city = post.city;
        var state = post.state;
        var zip = post.zip;
        var house = post.house;
        var interests = post.interests;
        var detailId = 0;

        var sql = "SELECT * FROM `student` WHERE `username`='" + username + "'";

        db.query(sql, (err, data) => {
            if (err) throw err;
            if (data.length != 0) {
                var sId = data[0].studentId;
                console.log("SID:" + sId);
                var sql2 = "INSERT INTO `student_details`(`fk_studentId`, `detailId`, `city`, `state`, `zip`, `street`, `house`, `interests`) VALUES ('" + sId + "','" + detailId + "','" + city + "','" + state + "','" + zip + "','" + street + "','" + house + "','" + interests + "')";
                db.query(sql2, (err, data) => {
                    if (err) throw err;
                    message = `Student has been successfully registered`;
                    res.redirect('/home/admin_studentlist/?msg=' + message);
                });
            } else {
                res.render('addstudentdetails.ejs', {
                    message: "Invalid student E-mail(Username). Kindly enter the registerd email."
                })
            }
        });
    } else {
        res.render('addstudentdetails.ejs');
    }
};
//---------------------------------------------student feedback submit call------------------------------------------------------
exports.studentfeedback = function (req, res) {
    var message = '';
    if (req.method == "POST") {
        var post = req.body;
        var name = post['student-name'];
        var email = post['student-email'];
        var msg = post['student-msg'];
        var feedbackId = 0;
        console.log(post);
        var sql = "INSERT INTO `student_feedback`(`feedbackId`, `student_name`, `student_email`, `student_feedback`) VALUES ('" + feedbackId + "','" + name + "','" + email + "','" + msg + "')";

        db.query(sql, (err, data) => {
            if (err) throw err;
            console.log("Inside feedback");
            //console.log(data);
            message = 'Feedback has been successfully recorded.';
            res.send(message);
        });
    } else {
        res.render('contact.ejs');
    }
};
//---------------------------------------------delete a student------------------------------------------------------
exports.deletestudent = function (req, res) {
    var message = '';
    if (req.method == "POST") {
        var post = req.body;
        var userId = post.sId;
        console.log(userId);
        var sql = "DELETE from `student_details` WHERE `fk_studentId`='" + userId + "'";
        var sql2 = "DELETE FROM `student` WHERE `studentId`='" + userId + "'";

        db.query(sql, (err, data) => {
            if (err) throw err;
            db.query(sql2, (err, data) => {
                if (err) throw err;
                console.log("Inside delete student");
                message = `Student records with StudentId: ${userId} have been deleted successfully.`;
                res.redirect('/home/admin_studentlist/?msg=' + message);
            });
        });
    } else {
        res.render('adminstudentlist.ejs');
    }
};
//--------------------------------edit button click on studentlist page--------------------------------
exports.editstudent = function (req, res) {

    var message = '';
    if (req.method == "POST") {
        var post = req.body;
        var userId = post.sId;
        console.log("Inside Edit Click:" + userId);
        res.render('updatestudent.ejs', {
            data: post
        });
    } else {
        res.render('adminstudentlist.ejs');
    }
};

//---------------------------------------------update a student------------------------------------------------------
exports.updatestudent = function (req, res) {
    var message = '';
    if (req.method == "POST") {
        var post = req.body;
        var userId = post.sId;
        var fname = post.first_name;
        var lname = post.last_name;
        var school = post.school;
        var grade = post.grade;
        var email = post.email;
        var mobile = post.contact_no;
        var cancelFlag = post.cancelFlag;
        //console.log(post);

        if (cancelFlag === 'Y') {
            res.redirect('/home/admin_studentlist');
        } else {
            var sql = "UPDATE `student` SET `first_name`='" + fname + "', `last_name`='" + lname + "',`mobile`='" + mobile + "',`username`='" + email + "',`school`='" + school + "',`grade`='" + grade + "' WHERE `studentId`='" + userId + "'";
            console.log(sql);
            db.query(sql, (err, data) => {
                if (err) throw err;
                console.log("Inside Edit Student:" + userId);
                message = `Student information successfully updated for student - '${fname} ${lname}'.`;
                res.redirect('/home/admin_studentlist/?msg=' + message);
            });
        }

    } else {
        res.render('adminstudentlist.ejs');
    }
};
//-----------------------------------------------common login page call------------------------------------------------------
exports.login = function (req, res) {
    var message = '';

    var sess = req.session;
    if (req.method == "POST") {
        var post = req.body;
        var name = post.user_name;
        var pass = post.password;
        var admin_flag = post.adminFlag;

        if (admin_flag === "N") {
            var sql = "SELECT * FROM `student` WHERE `username`='" + name + "'";
            db.query(sql, function (err, results) {
                if (results.length) {
                    if (passwordHash.verify(pass, results[0].pass)) {
                        req.session.userId = results[0].studentId;
                        req.session.user = results[0];
                        req.session.adminFlag = admin_flag;
                        console.log("STUDENT ID =" + results[0].studentId);
                        console.log("ADMIN FLAG =" + req.session.adminFlag);
                        res.redirect('/home/student_dashboard');
                    } else {
                        message = 'Wrong Password Entered.';
                        res.render('index.ejs', {
                            message: message
                        });
                    }

                } else {
                    message = 'Wrong Credentials.';
                    res.render('index.ejs', {
                        message: message
                    });
                }

            });
        } else if (admin_flag === "Y") {
            var sql = "SELECT * FROM `admin` WHERE `username`='" + name + "' and pass = '" + pass + "'";
            db.query(sql, function (err, results) {
                if (results.length) {
                    req.session.userId = results[0].adminId;
                    req.session.user = results[0];
                    req.session.adminFlag = admin_flag;
                    console.log("ADMIN ID =" + results[0].adminId);
                    console.log("ADMIN FLAG =" + req.session.adminFlag);
                    res.redirect('/home/admin_dashboard');
                } else {
                    message = 'Wrong Credentials.';
                    res.render('index.ejs', {
                        message: message
                    });
                }

            });
        }

    } else {
        res.render('index.ejs', {
            message: message
        });
    }

};

//-----------------------------------------------student dashboard page functionality----------------------------------------------

exports.studentdashboard = function (req, res, next) {

    var user = req.session.user,
        userId = req.session.userId;
    console.log('StudentId =' + userId);

    if (userId == null) {
        res.redirect("/login");
        return;
    }

    var sql = "SELECT * FROM `student` WHERE `studentId`='" + userId + "'";

    db.query(sql, function (err, data) {
        res.render('dashboard.ejs', {
            user: data
        });
    });
};

//-----------------------------------------------admin dashboard page functionality----------------------------------------------

exports.admindashboard = function (req, res, next) {

    var user = req.session.user,
        userId = req.session.userId;
    console.log('AdminId =' + userId);
    if (userId == null) {
        res.redirect("/login");
        return;
    }

    var sql = "SELECT * FROM `admin` WHERE `adminId`='" + userId + "'";

    db.query(sql, function (err, data) {
        res.render('admindashboard.ejs', {
            user: data
        });
    });
};

//------------------------------------common logout functionality----------------------------------------------
exports.logout = function (req, res) {
    var message = "Logged out successfully."
    req.session.destroy(function (err) {
        res.render("index.ejs", {
            message: message
        });
    })
};
//--------------------------------render student profile after login--------------------------------
exports.studentprofile = function (req, res) {

    var userId = req.session.userId;

    if (userId == null) {
        res.redirect("/login");
        return;
    }
    var sql = "SELECT studentId, first_name, last_name, mobile, username, gender, school, grade, house, interests, street, city, state, zip, dob, image_url FROM `student` INNER JOIN `student_details` WHERE `studentId` = `fk_studentId` AND `studentId`='" + userId + "'";
    db.query(sql, function (err, data) {
        console.log(data);
        if (err) throw err;
        res.render('profile.ejs', {
            user: data
        });
    });
};

//--------------------------------render student contact page after login--------------------------------
exports.studentcontact = function (req, res) {

    var userId = req.session.userId;

    if (userId == null) {
        res.redirect("/login");
        return;
    }

    var sql = "SELECT * FROM `student` WHERE `studentId`='" + userId + "'";
    db.query(sql, function (err, data) {
        res.render('contact.ejs', {
            user: data
        });
    });

};
//--------------------------------render admin profile after login--------------------------------
exports.adminprofile = function (req, res) {

    var userId = req.session.userId;

    if (userId == null) {
        res.redirect("/login");
        return;
    }
    var sql = "SELECT * FROM `admin` WHERE `adminId`='" + userId + "'";
    db.query(sql, function (err, data) {
        res.render('adminprofile.ejs', {
            user: data
        });
        console.log(data[0]);
    });
};

//--------------------------------render admin contact page after login--------------------------------
exports.admincontact = function (req, res) {

    var userId = req.session.userId;

    if (userId == null) {
        res.redirect("/login");
        return;
    }

    var sql = "SELECT * FROM `admin` WHERE `adminId`='" + userId + "'";
    db.query(sql, function (err, data) {
        res.render('admincontact.ejs', {
            user: data
        });
    });

};
//--------------------------------render admin studentlist page after login--------------------------------
exports.adminstudentlist = function (req, res) {

    var userId = req.session.userId;
    var message = '';

    if (req.query.msg != null) {
        message = req.query.msg;
    }
    var sql = "SELECT * FROM `admin` WHERE `adminId`='" + userId + "'";
    var sql2 = "SELECT * from `student`";

    db.query(sql, function (err, admindata) {
        db.query(sql2, function (err, data) {
            //console.log("111111111111111");
            res.render('adminstudentlist.ejs', {
                user: data,
                message: message,
                adminData: admindata
            });
        });
    });
    if (userId == null) {
        res.redirect("/login");
        return;
    }



};
//--------------------------------render admin addstudent page after login--------------------------------
exports.addstudent = function (req, res) {

    var userId = req.session.userId;

    if (userId == null) {
        res.redirect("/login");
        return;
    }

    var sql = "SELECT * FROM `admin` WHERE `adminId`='" + userId + "'";
    db.query(sql, function (err, data) {
        res.render('addstudent.ejs', {
            user: data
        });
    });

};

//--------------------------------render admin studentlist page after cancel--------------------------------
exports.cancel = function (req, res) {

    var userId = req.session.userId;
    var message = '';

    if (userId == null) {
        res.redirect("/login");
        return;
    }

    var sql = "SELECT * from `student`";
    db.query(sql, function (err, data) {
        //console.log("111111111111111");
        res.render('adminstudentlist.ejs', {
            user: data,
            message: message
        });
    });

};