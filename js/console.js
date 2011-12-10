
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


//KEYSTROKES
	keydown: function(event) {

		var command = this.currentCommand.get('html');

		if (event.key == 'enter') {
			event.preventDefault();
			
			if (loginflag == 1) { //check if login process done and over with
				this.run(); //if user logged in already, just run the command and continue as usual.
			}
			else {
				if (welcomeflag = 1) { //not logged in yet, still need to display welcome message
				this.clearScreen();
				this.helloThere(command);
				this.prompt(command);}
				else {
					this.prompt(command);}
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
			this.out('<span class="commandhelp">contact</span>Contact info.')
			this.out('<span class="commandhelp">date</span>Displays the current date.');
			this.out('<span class="commandhelp">help</span>Displays this list of available commands.');
			this.out('<span class="commandhelp">ls</span>List directories.');
			this.out('<span class="commandhelp">projects</span>List of current projects.');
			this.out('<span class="commandhelp">skills</span>SKILLZ.');
			this.out('<span class="commandhelp">resume</span>Displays a compact resume');
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
			this.out('kumimoko.yo[at]gmail[dot]com');
			this.prompt();
			return;
		}
		if (command == 'gui') {
			window.location.href = 'http://google.com/';
			this.prompt(username);
			return;
		} 
		
		if (command == 'date') {
			this.out(new Date());
			this.prompt();
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
			this.out("<span class='maninfo'><i>jessica</i>- strange girl who loves lemons, potatoes, and penguins.</span>");
			this.out("<span class='man'>SYNOPSIS</span>");
			this.out("<span class='maninfo'><i>jessica [OPTION]...</i></span>");
			this.out("<span class='man'>DESCRIPTION</span>");
			this.out("<span class='maninfo'>She's weird. She draws penguins everywhere. A jack of all trades. She draws, plays piano and violin,</span>");
			this.out("<span class='man'>OPTIONS</span>");
			this.out("<span class='maninfo'>-c &nbsp;&nbsp;&nbsp; contact information</span>");
			this.out("<span class='maninfo'>-p &nbsp;&nbsp;&nbsp; art portfolio (pdf)</span>");
			this.out("<span class='maninfo'>-q &nbsp;&nbsp;&nbsp; quotes</span>");
			this.out("<span class='maninfo'>-h &nbsp;&nbsp;&nbsp; hobbies</span>");
		}
			else if (page == 'psh') {
			this.out("<span class='man'><center>USER COMMANDS</center></span>");
			this.out("<span class='man'>NAME</span>");
			this.out("<span class='maninfo'><i>psh</i>- The Penguin SHell</span>");
			this.out("<span class='man'>SYNOPSIS</span>");
			this.out("<span class='maninfo'><i>psh </i></span>");
			this.out("<span class='man'>DESCRIPTION</span>");
			this.out("<span class='maninfo'>psh is not an actual shell. It merely tries to mimic one (and fails to in some aspects). This might displease some diehard UNIX lovers and UNIX-savvy individuals (sorry, too bad). Psh was written in Javascript with MooTools, and was made to be as user-friendly as possible. <br /> Its only purpose in life is to act as a website disguised as a console. </span>");

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
			
			this.out("Type 'goto ilovebubbles' to open a new window.");
			this.prompt(username);
			return;
		}
		
		if (command.substr(0,4) == 'goto') {
			var dest = command.substr(5);
			if (dest == 'ilovebubbles') { window.open("http://gmail.com/",'bubbles'); }
			else if (dest == '') { this.out('destination: blog, linkedin, spaniards'); }
			else { window.location.href = dest; };

			this.prompt(username);
			return;
		}

		if (command.substr(0,2) == 'ls') {
			var dest = command.substr(3).trim();
			var request = new Request.HTML().get('terminal.php?command=ls&path='+this.path+'/'+dest);
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

		if (command == 'press') {
			this.out('<span class="date">Mar 03, 2008</span> <span class="title">Interview with Elia</span> <a class="mp3" target="_blank" href="/press/20080303_entrevista_elia_eneko.mp3">mp3</a> <a class="www" target="_blank" href="http://www.elia.ws/blog/paso_por_paso_robles/">www</a>');
			this.out('<span class="date">Sep 30, 2007</span> <span class="title">Spaniards.es at Galicia Hoxe</span> <a class="pdf" target="_blank" href="/press/20070930_spaniards.es_galiciahoxe_page1.pdf">pdf1</a> <a class="pdf" target="_blank" href="/press/20070930_spaniards.es_galiciahoxe_page2.pdf">pdf2</a>');
			this.out('<span class="date">Sep 25, 2007</span> <span class="title">Spaniards.es at 5lineas.com</span> <a class="png" target="_blank" href="/press/20070925_spaniards.es_5lineas.com.png">png</a> <a class="www" target="_blank" href="http://5lineas.com/archivo/entrevistas/entrevista-a-eneko-alonso-spaniards/">www</a>');
			this.out('<span class="date">Mar 30, 2007</span> <span class="title">Spaniards.es at Infoempleo</span> <a class="pdf" target="_blank" href="/press/20070330_spaniards.es_infoempleo.pdf">pdf</a>');
			this.out('<span class="date">Feb 08, 2006</span> <span class="title">Spaniards.es at Diario de Navarra</span> <a class="pdf" target="_blank" href="/press/20060208_spaniards.es_diariodenavarra.pdf">pdf</a>');
			this.prompt(username);
			return;
		}

		if (command == 'projects') {
			this.out('<b>spaniards.es</b> - An online community for Spanish people living abroad (<a target="_blank" href="http://www.spaniards.es">www.spaniards.es</a>)');
			this.out('<b>vaka-framework</b> - A Mootools based set of classes (<a target="_blank" href="http://vaca-framework.googlecode.com">vaca-framework.googlecode.com</a>)');
			this.prompt(username);
			return;
		}

		if (command == 'skills') {
			this.out('<b><i>Eneko Alonso’s Specialties:</i></b>');
			this.out('PHP, Javascript, AJAX, jQuery, Mootools, Prototype, Scriptaculous, Drupal');
			this.out('C/C++, Delphi, Python and Cocoa/Objective-C');
			this.out('MySQL, Sybase and Oracle');
			this.prompt(username);
			return;
		}

		if (command == 'svn') {
			this.out('<a target="_blank" href="http://enekoalonso.com/svn">enekoalonso.com/svn</a> - SVN code repository I use for research and development');
			this.prompt(username);
			return;
		}
		
		if (command == 'resume') {
			this.out(' - <b><i>Senior Engineer</i></b> at LEVEL Studios since June 2008');
			this.out(' - <b><i>Founder/CEO</i></b> at Spaniards.es LLC since November 2005');
			this.out(' - <b><i>Lead Programmer/Analyst</i></b> at 3i Infotech from January 2005 to June 2008');
			this.out(' - <b><i>Programmer/Analyst</i></b> at Fedetec from October 2002 to December 2004');
			this.out(' - <b><i>Senior Programmer</i></b> at Cap Gemini Ernst &amp; Young from April 2001 to August 2002');
			this.out(' - <b><i>Programmer</i></b> at Axpe Consulting &amp; Price Waterhouse Coopers from October 2000 to April 2001');
			this.prompt(username);
			return;
		}
		
		if (command == 'whois') {
			this.out('<img src="/img/eneko.jpg"/><b>Eneko Alonso</b> is a software enginner with more than eight years of experience in web, desktop and server software:<br/><i class="bio">I am a software engineer who likes beautiful code and good design. I love debugging and digging into the code, finding out how things work. During my career I have worked on client/server environments, both Unix and Windows, developing multi threaded services and DB driven software. I have also been in contact with web development, both front and back end, learning from the latest technologies and putting them in practice in multiple projects.</i>');
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



