
![Audelia](http://imgur.com/a/G50ef)
###Audelia
  This is an app targeted towards individuals in difficult situations who want to talk, but don't want to/unable to discuss things with their friends/family/counselor.  It's an anonymous community where users can make posts on the forum, comment on posts, receive resources if they need it, and be updated about local events going on in the Bay Area.

####Technologies Used
  - MongoDB/Mongoose
  - Express
  - AngularJS
  - Node.js
  - Bootstrap
  - Heroku
  - Animate.CSS
  - 500px

###Installation Steps
  -

###User Stories
  - User can create and view posts
  - User can comment on posts
  - User can heart posts
  - User has access to hide button on every screen
  - User has events tab rendering local bay area events
  - User has resources tab showing websites for mental health/support


###Future Development
  - Sign Up/Login
  - Panic button with texts to two contacts
  - Events that update automatically with search bar by location
  - Report feature to report posts/comments


####Code Snippets
Typewriter :


<div class="page-header typewriter">
  <h1 id="title">Welcome to <span id="aud">Audelia</span></h1>
  <h2 id="title-script">...we're happy you're here...</h2>
</div>

.typewriter #title{
  overflow: hidden;
  border-right: .15em solid orange;
  white-space: nowrap;
  margin: 0 auto;
  letter-spacing: .2em;
  animation:
    typing 3.0s steps(20, end),
    blink-caret .7s step-end infinite;
}

@keyframes typing {
  from {width: 0}
  to {width: 100%}
}

@keyframes blink-caret {
  from, to {border-color: transparent;}
  50% { border-color: #77505F; }
}
