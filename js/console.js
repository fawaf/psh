// Y U LOOK AT MY SOURCE CODE FOO? IT'S ATROCIOUS. 

//flags for stuffs.
username = "";
loginflag = 0;
welcomeflag = 0;

var Terminal = new Class({

	commandHistory: [],
	commandHistoryIndex: -1,

	initialize: function(container) {
		
		this.terminal = container;
		this.out('Hello stranger.');
		this.out('Enter a username (e.g., "guest") and hit &lt;return&gt; to begin.');
		this.out('<br />');
		this.displayLogin();
		this.path = '.';
		
		// Hook events
		$(document).addEvent('keydown',  function(event) { this.keydown(event); }.bind(this));
		$(document).addEvent('keypress', function(event) { this.keypress(event); }.bind(this));
	},
	
	helloThere: function(name) {
		this.out("************************<br /><br />");
		this.out("Greetings " + name +"!");
		this.out("Welcome to <a href=\"http://flaming-toast.com/\">flaming-toast.com</a>");
		this.out("<span class='man'>TYPE `help' FOR A LIST OF COMMANDS.</span>");
		this.out("<br />************************");
		
	}, 

 hasWhiteSpace: function(str) {
  space = /\&nbsp\;/i;

  return space.test(str);
},

//KEYSTROKES
	keydown: function(event) {

		var command = this.currentCommand.get('html');

		if (event.key == 'enter') {
			event.preventDefault();
			
			if (loginflag == 1) { //check if login process done and over with
				this.run(); //if user logged in already, just run the command and continue as usual.
			}
			else if (command.length > 20) {
				this.out("Username too long. Try again.");
				this.displayLogin();
			}
			else if (command.length < 2) {
				this.out("Username too short. Try again.");
				this.displayLogin();
			}
			else if (this.hasWhiteSpace(command)) {
				this.out("Username has whitespace. Try again.");
				this.displayLogin();
			}
			else {
				if (welcomeflag = 1) { //not logged in yet, still need to display welcome message
				this.clearScreen();
				this.helloThere(command);
				this.prompt(command);}
				else {
					this.prompt(command);
					}
			}
			return;
		}

                if (event.key == 'backspace') {
                        event.preventDefault();
                        if (command.substr(command.length-6) == '&nbsp;') {
                                command = command.substr(0, command.length-6);
                        } else {
                                command = command.substr(0, command.length-1);
                        }
                        this.currentCommand.set('html', command);
                        return;
                }
                
            if (event.code > 64 && event.code < 91) {
			event.preventDefault();
				if (event.shift) {
				command += String.fromCharCode(event.code);
				}
				else {
					command += String.fromCharCode(event.code+32);
				}
			this.currentCommand.set('html',command);
			return;
			
		}
		
		if (event.code == 190) {
			event.preventDefault();
				command += '.';
			this.currentCommand.set('html', command);
			return;
		}
		
		if (event.code > 44 && event.code < 58) { //numbers
			event.preventDefault();
				command += String.fromCharCode(event.code);
				this.currentCommand.set('html', command);
				return;
			}
			
	var charStr = String.fromCharCode(event.code);
    if (charStr == "&" || charStr == "_") {
        command += charStr;
        this.currentCommand.set('html', command);
        return;
    }


	},
	clearScreen: function() {
		this.currentPrompt = null;
			this.terminal.empty();

			return;
		},

	keypress: function(event) {
		var command = this.currentCommand.get('html');
		
		if (event.key == 'space') {
			event.preventDefault();
			command += '&nbsp;';
			this.currentCommand.set('html', command);
			return;
		}

		if (event.code == 38) { // Up arrow
			event.preventDefault();
			dbg(this.commandHistoryIndex + ', ' + this.commandHistory.length);
			if (this.commandHistoryIndex > 0) {
				this.commandHistoryIndex--;
				this.currentCommand.set('html', this.commandHistory[this.commandHistoryIndex]);
			}
			return;
		}

		if (event.code == 40) { // Down arrow
			event.preventDefault();
			dbg(this.commandHistoryIndex + ', ' + this.commandHistory.length);
			if (this.commandHistoryIndex < this.commandHistory.length) {
				this.commandHistoryIndex++;
				this.currentCommand.set('html', this.commandHistory[this.commandHistoryIndex]);
				// This can overflow the array by 1, which will clear the command line
			}
		}

		// For all typing keys
		if (this.validkey(event.code)) {
			event.preventDefault();
			if (event.code == 46) {
				command += '.';
			} //else {
				//command += event.key;
			//}
			this.currentCommand.set('html', command);
			return;
		}
	},
	validkey: function(code) {
		return  //(code > 64 && code < 91)  ||	// [A-Z]
				(code > 96 && code < 123) ||	// [a-z]
				(code == 95) || // _
				(code > 44 && code < 58);		// -./[0-9]
	},

	// Outputs a line of text
	out: function(text) {
		var p = new Element('div');
		p.set('html', text);
		this.terminal.grab(p);
	},
	

		
	// Displays the prompt for command input
	prompt: function(user) {
		loginflag = 1;
		username = user;
		welcomeflag = 1;

		if (this.currentPrompt)
			this.currentPrompt.getElement('.blink').destroy();

		this.currentPrompt = new Element('div');
		this.currentPrompt.grab(new Element('span').addClass('prompt').set('text', user+'@FLAMING-TOAST: '));
		this.currentCommand = new Element('span').addClass('command');
		this.currentPrompt.grab(this.currentCommand);
//		this.currentPrompt.grab(new Element('span').addClass('cursor'));
		this.currentPrompt.grab(new Element('span').addClass('blink').set('text', '▋'));
		this.terminal.grab(this.currentPrompt);
		$(window).scrollTo(0, this.currentPrompt.getPosition().y);
	},

	guess: function() {
		var command = this.currentCommand.get('html');
		if (command.substr(0,1) == 'c')
			command = 'copy';
		this.currentCommand.set('html', command);
	},

	// Executes a command
	run: function() {

		var command = this.currentCommand.get('text');
		
		this.commandHistory.push(command);
		this.commandHistoryIndex = this.commandHistory.length;
		if (command == 'help') {
			this.out('<span class="man">LIST OF AVAILABLE COMMANDS</span>');
			this.out('<span class="commandhelp">clear</span>Clear screen.')
			this.out('<span class="commandhelp">gui</span>Redirect to alternate graphic-based website.');
			this.out('<span class="commandhelp">psh</span>Version of the shell you\'re using.');
			this.out('<span class="commandhelp">portfolio</span>Link to art portfolio.</span>');
			this.out('<span class="commandhelp">blog</span>I ramble...ramble..and ramble..');
			this.out('<span class="commandhelp">contact</span>Contact info.')
			this.out('<span class="commandhelp">date</span>Displays the current date.');
			this.out('<span class="commandhelp">help</span>Displays this list of available commands.');
			this.out('<span class="commandhelp">ls</span>List directories.');
			this.out('<span class="commandhelp">projects</span>List of current projects.');
			this.out('<span class="commandhelp">skills</span>SKILLZ.');
			this.out('<span class="commandhelp">resume</span>Displays a mini resume');
			this.out('<span class="commandhelp">jessica</span>Run this command at your own risk.');
			this.out('<span class="commandhelp">ilovebubbles</span>Link to a certain someone\'s webpage');
			this.out('<span class="commandhelp">logout</span>Exit current user session.');
			
			
			this.prompt(username);
			return;
		}

		if (command == 'clear') {
			this.currentPrompt = null;
			this.terminal.empty();
			this.helloThere(username);
			this.prompt(username);
			return;
		}

		if (command == 'blog') {
			this.out('#!hashbang -- my personal blog');
			this.out('<a href="http://hashbang.phpfogapp.com/">Link</a>');
		}

		if (command == 'portfolio') {
			this.out("Portfolio not up yet!");
			this.prompt(username);
			return;
		}
		if (command == 'logout') {
			welcomeflag = 0;
			username = "";
			loginflag = 0;
		this.currentPrompt = null;
		this.terminal.empty();

		this.out('Hello stranger.');
		this.out('Enter a username (e.g., "guest") and hit &lt;return&gt; to begin.');
		this.out('<br />');
		this.displayLogin();
		this.path = '.';
		return;
	}
			
		if (command == 'contact') {
			this.out('Please send questions, comments, hate mail, etc. to kumimoko.yo[at]gmail[dot]com.');
			this.prompt(username);
			return;
		}
		if (command == 'gui') {
			window.location.href = '/gui/index.html';
			this.prompt(username);
			return;
		} 
		
		if (command == 'date') {
			this.out(new Date());
			this.prompt(username);
			return;
		}
		
		if (command == 'jessica') {
			this.out("<br />");
			this.out("<pre id='penguin'>NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNmmmmdddddmNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN<br />NNNNNNNNNNNNNNNNNNNdhysoooooooossyhhhhhhysooosshmNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN<br />NNNNNNNNNNNNNNNNNy/--/osdmNNNNNNNNNNNNNNNNNNNNdyo+oshNNNNNNNNNNNNNNNNNNNNNNNNNNN<br />NNNNNNNNNNNNNNNNNNNNms-`:odNNNNNNNNNNNNNNNNNNNNNNNNmyooymNNNNNNNNNNNNNNNNNNNNNNN<br />NNNNNNNNNNNNNNNNNNNh/-odNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNho+yNNNNNNNNNNNNNNNNNNNNN<br />NNNNNNNNNNNNNNNNNh:/yNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNho+dNNNNNNNNNNNNNNNNNN<br />NNNNNNNNNNNNNNNy:+dNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNmoodNNNNNNNNNNNNNNNN<br />NNNNNNNNNNNNNd/omNmhsyhNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNdoodNNNNNNNNNNNNNN<br />NNNNNNNNNNNm++hyo/.-hNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNh/+mNNNNNNNNNNNN<br />NNNNNNNNNNy-://oy+-dNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNmo:hNNNNNNNNNNN<br />NNNNNNNNNo:ohmNNy:mNNNNNNNNNNNNNNNNNNNNNNNNNNNyNNNNNNNNNNNNNNNNNNNNh-yNNNNNNNNNN<br />NNNNNNNNNmNNNNNh:mNNNNNNmmNNNNNNNNNNNNNNNNNNNs+NNNNNNNNNNNNNNNNNNNNNd-sNNNNNNNNN<br />NNNNNNNNNNNNNNm:dNNNNNNd-hNNNNNNNNNNNNNNNNNNN-om/dNNNNNNNNNNNNNNNNNNNd-sNNNNNNNN<br />NNNNNNNNNNNNNN/yNNNNNNNo`dhmNNNNNNNNNNNNNNNNN.`.`sNNNNNNNNNNNNNNNNNNNNh.oNNNNNNN<br />NNNNNNNNNNNNNs/NNNNNNNN+`:.sNNNNNNNNNNNNNNNNN+```yNNNNNNNNNNNNNNNNNNNNNy`+NNNNNN<br />NNNNNNNNNNNNm:mNNNNNNNNo```sNNNNNNNNNNNNNNNNNm+-:mNNNNNNNNNNNNNNNNNNNNNNo`sNNNNN<br />NNNNNNNNNNNNsyNNNNNNNNNh```hNNNNNNNNNNNNNNNNNNNmNNNNNNNNNNNNNNNNNNNNNNNNN:.mNNNN<br />NNNNNNNNNNNN+NNNNNNNNNNNs/sNNmddhhhhhhhhhhyyyyyhdmNNNNNNNNNNNNNNNNNNNNNNNm-/NNNN<br />NNNNNNNNNNNsyNNNNNNNNNNNmhyssyhdddmmmmmmmmmmmdddhyohNNNNNNNNNNNNNNNNNNNNNNs`hNNN<br />NNNNNNNNNNN/mNNNNNNNNNNd/ydmNNNNNNNNNNNNNNNNNNNNNdosNNNNNNNNNNNNNNNNNNNNNNm.:NNN<br />NNNNNNNNNNh+NNNNNNNNNNNdoyhddddddddddmddhhyyyyyyyhdNNNNNNNNNNNNNNNNNNNNNNNNo`hNN<br />NNNNNNNNNN+hNNNNNNNNNNNNNNmddddddddddmmdmmmNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNd.:NN<br />NNNNNNNNNm:NNNNNNNNNNNNNNNNNNNNNNNmdddmmNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN/`dN<br />NNNNNNNNNh/NNNNNNNNNNNNNNNNNNdhyssssss+++sdNNNNNNNNNNNNNNNdNNNNNNNNNNNNNNNNNd`sN<br />NNNNNNNNNooNNNymNNNNNNNNNNmhoshmNNNNNNNNdy//odNNNNNNNNNNNN+dNNNNNNNNmNNNNNNNN:+N<br />NNNNNNNNN+yNNN+hNNNNNNNNmhoymNNNNNNNNNNNNNNdo:/hmNNNNNNNNNhoNNNNNNNm-hNNNNNNN+/N<br />NNNNNNNNN/hNNNy/NNNNNNNhoyNNNNNNNNNNNNNNNNNNNmy-:yNNNNNNNNm:mNNNNNNo-mNNNNNNN+oN<br />NNNNNNNNN/ymNNN:yNNNNNy+mNNNNNNNNNNNNNNNNNNNNNNms./mNNNNNNN/yNNNNNo-dNNNNNNNN/yN<br />NNNNNNNNN/ooshdo.mNNNosNNNNNNNNNNNNNNNNNNNNNNNNNNh--hNNNNNNs:NNNd//mNNNNNNNNm:mN<br />NNNNNNNNN:oNmhyyhNNNoyNNNNNNNNNNNNNNNNNNNNNNNNNNNNm/.sysymNh.Nd+:sNNNNNNNNNNsoNN<br />NNNNNNNNN//NNNNNNNNosNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNm-.sdo/sm:+/sNNNNNNNNNNNd:mNN<br />NNNNmhy+/-.mNNNNNNhoNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNm:yNNNNoomNNNNNNNNNNNNNm/yNNN<br />NNmooyhddh+oNNNNNm/NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNm/sNNNNNN+oNNNNNNNNNNNNN/+NNNN<br />NNy:mNNNNNN+yNNNN+yNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN+oNNNNNNNN:yNNNNNNNNNNm/+NNNNN<br />NNNy/hNNNNNN+yNNd/NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNy/NNNNNNNNNd-dNNNNNNNNd:sNNNNNN<br />NNNNd/sNNNNNNosNodNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN-dNNNNNNNNNNo+NNNNNNdo/hNNNNNNN<br />NNNNNNo+dNNNNNy/:mNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNy:NNNNNNNNNNNm-mNNNd+/hNNNNNNNNN<br />NNNNNNNh:sNNNNNm/+dNNNNNNNNNNNNNNNNNNNNNNNNNNNNN/oNNNNNNNNNNNNoomy/+dNNNNNNNNNNN<br />NNNNNNNNm/:dNNNNNh++hNNNNNNNNNNNNNNNNNNNNNNNNNNN-dNNNNNNNNNNNNy./smNNNNNNNNNNNNN<br />NNNNNNNNNNh:+dNNNNNmo/ohmNNNNNNNNNNNNNNNNNNNNNNN-dNNNNNNNNNNNN/-mNNNNNNNNNNNNNNN<br />NNNNNNNNNNNNh++ymmmmmds-./ymNNNNNNNNNNNNNNNNNNNN:yNNNNNNNNNNNs.dNNNNNNNNNNNNNNNN<br />NNNNNNNNNNNNNNmhsoo++oshmhs+///oshdmmmmmNNNmddhy::dNNNNNNNms:/dNNNNNNNNNNNNNNNNN<br />NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNmmdyysyssssoossyhmmdo+osso++oymNNNNNNNNNNNNNNNNNNN<br />NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN</font></pre>");
			this.out("Type `man jessica' for more information.");
			this.prompt(username);
			return;
		}
		if (command.substr(0,3) == 'man') {
			var page = command.substr(4);
			if (page == 'jessica') {
			this.out("<span class='man'><center>USER COMMANDS</center></span>");
			this.out("<span class='man'>NAME</span>");
			this.out("<span class='maninfo'><i>jessica</i> -  girl obsessed with lemons, potatoes, and penguins.</span>");
			this.out("<span class='man'>SYNOPSIS</span>");
			this.out("<span class='maninfo'><i>jessica [OPTION]...</i></span>");
			this.out("<span class='man'>DESCRIPTION</span>");
			this.out("<span class='maninfo'>She is a very strange girl, I can tell you that. She loves to draw and doodle, make music, and sleep. Her favorite Starcraft unit is the SCV. </span>");
			this.out("<span class='man'>OPTIONS</span>");
			this.out("<span class='maninfo'>-a &nbsp;&nbsp;&nbsp; activities</span>");
			this.out("<span class='maninfo'>-c &nbsp;&nbsp;&nbsp; contact information</span>");
			this.out("<span class='maninfo'>-p &nbsp;&nbsp;&nbsp; art portfolio (pdf)</span>");
			this.out("<span class='maninfo'>-r &nbsp;&nbsp;&nbsp; resume</span>");

		}
			else if (page == 'psh') {
			this.out("<span class='man'><center>USER COMMANDS</center></span>");
			this.out("<span class='man'>NAME</span>");
			this.out("<span class='maninfo'><i>psh</i>- The Penguin SHell</span>");
			this.out("<span class='man'>SYNOPSIS</span>");
			this.out("<span class='maninfo'><i>psh </i></span>");
			this.out("<span class='man'>DESCRIPTION</span>");
			this.out("<span class='maninfo'>psh is not an actual shell. It merely tries to mimic one (and fails to in some aspects). This might displease some diehard *NIX users and *NIX-savvy individuals (sorry, too bad). Psh was written in Javascript with MooTools, and was made to be as user-friendly as possible. Its only purpose is to act as a website disguised as a console. </span>");

		}
			else { 
				this.out("No manual entry for " + page);
			}
			
			this.prompt(username);
			return;
	}
		if (command == 'ilovebubbles') {
			this.out("<pre id='bubbles'>KKKWKKKKEEEEDEEDEDEDKEDEEEDDDEKKEDDDEEEE<br />KKKWKKKEEEEDEEEEEDEGjti;LDDDEEEKEDGEEEED<br />KEKKKKKEEEEDDEEEDtt,:,,,:::,;fEEEDDEEEEE<br />KEKKKKKEEEDDDEEji,;,:,:,,;,:,:,iDGGDEEED<br />KKWKKKEEEEEEEDti;;;:;;;iitiiii;tDDDDEEED<br />EKWKKKEEEEEEE;;ii;,.,,,,;,;;;;;GDDDEEEED<br />EKWKKEEEEEEEWKKWK,,:::,:K,,,,;iKDLDEEDDD<br />KWKKKEEKKEE#KWW#W#,,:,,: DKi,;DEDDEEEEDD<br />KWKKKEEEKE######WWG,.,,,:EEEKtKEDGDDEDDD<br />WWWKKEEEKtiWWKK##WW.:,,,,,EEWWEEDLGEEDEG<br />WKKKKEEKi,:iEWW####;:,,,,:DKKWEEGDDEDDDD<br />KKKKKKEii;;,########,,,:::WWKKEti;;iLDDG<br />KKKKKEj;,,,;,#######G:,:,:,WWKi;;,;;;GDD<br />KKKKKKi,::,,,#####WKW:,::,,WWE;;;;;;;DDD<br />WKKKEt;,,;W,,iW#W#WWK,,::,,WWWE;;;;;;DDD<br />WKKKKi,,,;i,,;KWWWWKK;,,,,:KWKD;;i;;tDDD<br />KKKKKi;;,,,,,,DKKKKELL,,,,,KWKE;;;;,DDDE<br />KKKKEti;;,,;,,;;;;,;;;i;;;;KWWt;i;,tDEEE<br />WKKKK,;;,,,,,,;,,,,,,;;;;;;KWW;it;;DDEDD<br />KKKEKt;,,;,,,,;,,,,,;;;;;;iKWKij;;iDDDED<br />KKKKKWt;,;;,,;i,,,,,i;iii;iKWiii;;jEDDED<br />EEEEEEKt;;i;,i;,,,,;;if;;,GWWjf;;tEDEEDD<br />KKKEEEE#ii;;;t;,,,;;;ji;;iKW,jtiiEDEEEEE<br />EEKEEEEEDjiitj;;;i;if,;ijG#LG;fjKEDDEEDE<br />EEEKKEEDEEDjjti;i;;,W;tLGEEEiKEEDEEEEEED<br />KEEKEEDEEEEDEEjtiiiWEDEEEEEEEEEEEEEEEEDE<br />EEEEEEDEEDDDDEEWji#EEDDDDEEEEEEEEWKKEEDE<br />EEEEEEEDDEDDDDDEDDDEEDDDDDEEDEEEEEEEEKWK<br />EKEEEEEDDDDDDDDDDEDEEDDDDDDDEEEEEEEKKK#G<br />EEEEEEEDDDDEKDDDDDDDDDEDEEDDDEEEEEEKKEW#</pre>");
			
			this.out("This is a striped goldfish, in case you couldn't tell.");
			this.out("<a href=\"http://bubbles.com/\">NERSOR</a>");
			
			this.prompt(username);
			return;
		}
		
/*		if (command.substr(0,4) == 'goto') {
			var dest = command.substr(5);
			if (dest == 'ilovebubbles') { window.open("http://gmail.com/",'bubbles'); }
			else if (dest == '') { this.out('destination: blog, linkedin, spaniards'); }
			else { window.location.href = dest; };
			this.prompt(username);
			return;
		}
*/
		//NOT IMPLEMENTED YET
/*		if (command.substr(0,2) == 'ls') {
			var dest = command.substr(3).trim();
			var request = new Request.HTML().get('index.php?command=ls&path='+this.path+'/'+dest);
			request.addEvent('complete', function() {
				if (request.isSuccess()) {
					this.out(request.response.html);
				} else {
					this.out('Error: server request failed.');
				}
				this.prompt(); // Do not show prompt until ajax call is complete
			}.bind(this));
			return;
		}
*/


		if (command == 'projects') {
			this.out("<font class='highlight'>SC1 SCV plush</font> - I ASSURE YOU, THIS WILL BE MADE ONE DAY.</span>");
			this.out("<font class='highlight'>PenguinSHell</font> - workin' on this fake terminal for this site");
			this.prompt(username);
			return;
		}

		if (command == 'skills') {
			this.out('I HAS NO SKILLS ;w;');
			this.prompt(username);
			return;
		}

		if (command == 'resume') {
			this.out("Resume? What resume?");
			this.prompt(username);
			return;
		}
		
		if (command == 'psh') {
			this.out('Currently running <font class="highlight">PenguinShell \(psh\) v 0.1</font>');
			this.out('Written in Javascript with MooTools');
			this.out('Type `man psh\' for more information about this hugely dysfunctional shell.');
			this.prompt(username);
			return;
		}
		if (command)
			this.out('-psh: ' + command + ': command not found');

		this.prompt(username);
	},
		//login a user
	displayLogin: function() { 

			if (this.currentPrompt)
			this.currentPrompt.getElement('.blink').destroy();

		this.currentPrompt = new Element('div');
		this.currentPrompt.grab(new Element('span').addClass('prompt').set('text', 'login: '));
		this.currentCommand = new Element('span').addClass('command');
		this.currentPrompt.grab(this.currentCommand);
//		this.currentPrompt.grab(new Element('span', {'id':'cursor'}));
		this.currentPrompt.grab(new Element('span').addClass('blink').set('text', '▋'));
		this.terminal.grab(this.currentPrompt);

		$(window).scrollTo(0, this.currentPrompt.getPosition().y);
		
		
	},
	blink: function() {
		var poop = document.getElementbyId("cursor"); 
		poop.setStyle('background-color', '#000000');
		
	}

});

$(window).addEvent('domready', function() {
	window.terminal = new Terminal($('terminal'));
});



function blink() {
	var poop = document.getElement('.blink');
	poop.style.display = "none";
}
blink();
