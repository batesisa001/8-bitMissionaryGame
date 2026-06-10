// ============================================================
// FIRST-CONTACT DIALOGUE TREES (one per archetype)
// ============================================================
const TREES = {};

TREES.seeker = h => ({ start:'a', nodes:{
  a: n(h, `The door opens. A man in his thirties looks at your name tags, and something flickers in his eyes.\n"Missionaries, huh. You know... my sister passed away this spring. I've been wondering about a lot of things lately."`, [
    o(`"I'm so sorry for your loss. May I ask — what kinds of things have you been wondering?"`, 'listen', ()=>{ h.interest+=12; addSpirit(2); }),
    o(`"We have a message that answers exactly those questions. Can we come in and share it?"`, 'fast', ()=>{ h.interest+=4; }),
    o(`Hand him a pamphlet about the Plan of Salvation and offer to come back.`, 'pamph', ()=>{ h.interest+=6; bump('cards'); }),
  ]),
  listen: n(h, `He leans against the doorframe and talks for a while — about his sister, about whether God is really there, about a prayer he half-said in the hospital parking lot.\n"Sorry. You probably have a script you're supposed to do."`, [
    o(`"No script. We teach people, not lessons. What you're feeling — God hears those parking-lot prayers."`, 'invite', ()=>{ h.interest+=10; addSpirit(3); }),
    o(`Bear testimony that families can be together forever through Jesus Christ.`, 'invite', ()=>{ h.interest+=8; addSpirit(3); }),
  ]),
  fast: n(h, `He hesitates. "Maybe. I don't know if I'm up for a whole presentation today, honestly."`, [
    o(`"Then no presentation. Just tell us about your sister, if you'd like."`, 'listen', ()=>{ h.interest+=8; addSpirit(2); }),
    o(`"We understand. Could we come back another day?"`, 'invite2'),
  ]),
  pamph: n(h, `He turns the pamphlet over. " 'The Plan of Salvation.' Huh. Where was she before she was born... where is she now." He looks up. "Do you actually believe you know the answers to these?"`, [
    o(`"We do. And you don't have to take our word for it — you can ask God yourself."`, 'invite', ()=>{ h.interest+=8; }),
  ]),
  invite: n(ME, `"Mr. Whitfield, we'd love to sit down and talk about where your sister is now, and how you can see her again. Could we share that message with you — now, or another time?"`, [
    o(`(He glances at his watch.) "...You know what? Come in. I want to hear this."`, 'teach', ()=>{ h.stage='investigator'; bump('friends'); bump('convos'); }),
  ]),
  invite2: n(h, `"Yeah... yeah, okay. Tomorrow evening? I get home around six."\nHe shakes both your hands. His grip lingers a second longer than it needs to.`, [
    o(`"We'll be here. Thank you, Sam."`, 'END', ()=>{ h.stage='appt'; h.apptDay=day+1; bump('appts'); bump('convos'); }),
  ]),
  teach: n('narr', `Sam moves a stack of mail off the couch and you sit down. (You'll teach him the first lesson now.)`, 'END', ()=>{ h.teachNow = true; }),
}});

TREES.student = h => ({ start:'a', nodes:{
  a: n(h, `A college-age woman answers, laptop under one arm. "Oh hey — actual missionaries. I'm literally writing a paper on American religious movements right now. You're, like, primary sources."`, [
    o(`"Happy to help with the paper. What questions do you have?"`, 'q', ()=>{ h.interest+=8; }),
    o(`"We're a bit more than a research topic — this message changed our lives. Got ten minutes?"`, 'direct', ()=>{ h.interest+=5; }),
    o(`Offer her a Book of Mormon — "the primary-est source there is."`, 'bom', ()=>{ h.interest+=7; }),
  ]),
  q: n(h, `"Okay — do Mormons— sorry, what's the right term?"\nYou explain: members of The Church of Jesus Christ of Latter-day Saints. She fires off questions about Joseph Smith, the gold plates, why you do missions at nineteen. They're genuine questions, not gotchas.`, [
    o(`Answer plainly, and tell her why YOU chose to come on a mission.`, 'warm', ()=>{ h.interest+=10; addSpirit(2); }),
    o(`Stick to official talking points.`, 'cool', ()=>{ h.interest+=2; }),
  ]),
  direct: n(h, `"Ten minutes is a lecture's worth of attention. Sure, go." She sits on the porch step and actually listens.`, [
    o(`Briefly share the story of the First Vision.`, 'warm', ()=>{ h.interest+=8; }),
  ]),
  bom: n(h, `She takes it and flips through. "You're just giving this away? There's like 500 pages here."\n"Free of charge. There's a promise at the end — Moroni 10:4 — that if you read it and ask God sincerely, He'll tell you it's true."`, [
    o(`Write your number inside the cover for questions.`, 'warm', ()=>{ h.bom=true; bump('boms'); h.interest+=6; }),
  ]),
  warm: n(h, `"Huh. You know, I expected this to be weirder." She laughs. "Could you two come back? I have SO many more questions, and honestly the praying-about-it thing is a better methodology than half my sources."`, [
    o(`"It's a date— a RETURN APPOINTMENT. We'll see you Thursday."`, 'END', ()=>{ h.stage='appt'; h.apptDay=day+1; bump('appts'); bump('convos'); bump('friends'); }),
  ]),
  cool: n(h, `She nods politely, taking notes. "Cool. Thanks, this is useable." The door closes — a citation, but not a connection.`, [
    o(`(Leave.)`, 'END', ()=>{ bump('convos'); h.interest-=2; h.rejectedUntil=day+1; }),
  ]),
}});

TREES.busy = h => ({ start:'a', nodes:{
  a: n(h, `The door flies open mid-chaos — a toddler on her hip, a smoke alarm chirping somewhere, a kid yelling about a missing shoe. "Hi— sorry— we're kind of— LUCAS, IT'S UNDER THE COUCH — kind of in the middle of something?"`, [
    o(`"Totally understand! When's a better time? We'll be quick, we promise."`, 'appt', ()=>{ addSpirit(1); }),
    o(`"This will only take fifteen minutes—" (push through)`, 'push', ()=>{ addSpirit(-4); }),
    o(`"Can we help? Seriously — we're great at finding shoes."`, 'serve'),
  ]),
  appt: n(h, `She blows hair out of her face. "Honestly? Saturday morning. My husband's home and the kids are at soccer. You've got the survival instincts of people who'll actually show up on time."`, [
    o(`"Saturday it is. Good luck with the shoe."`, 'END', ()=>{ h.stage='appt'; h.apptDay=day+2; bump('appts'); bump('convos'); }),
  ]),
  push: n(h, `Her smile goes flat. "No. Sorry." The door closes, and through it you hear the smoke alarm finally give up.\nElder Sorensen winces. "Preach My Gospel says we adapt to people's needs, Elder. Not the other way around."`, [
    o(`(He's right. Note it for next time.)`, 'END', ()=>{ h.rejectedUntil=day+2; bump('doors'); }),
  ]),
  serve: n('narr', `Twenty minutes later: shoe recovered (under the couch, as prophesied), alarm battery changed, toddler high-fived. Brianna laughs for the first time. "Okay, who ARE you guys?"`, [
    o(`"Missionaries. We do doors AND shoes. Could we come back Saturday and share why we do it?"`, 'END', ()=>{ tc(20); h.stage='appt'; h.apptDay=day+2; bump('appts'); bump('service'); addSpirit(5); h.interest+=12; bump('convos'); }),
  ]),
}});

TREES.skeptic = h => ({ start:'a', nodes:{
  a: n(h, `A man in a faded engineering-school t-shirt looks at your tags over his glasses. "Latter-day Saints. Okay. I'll save you the time, fellas — I'm an atheist, and I've read more about your church's history than you have."`, [
    o(`"Then you know more than most people we meet! What did you find most interesting?"`, 'engage', ()=>{ h.interest+=6; }),
    o(`"Can I ask what you DO believe in? We didn't come to argue — we're curious about people."`, 'common', ()=>{ h.interest+=8; addSpirit(2); }),
    o(`Debate him point by point.`, 'debate', ()=>{ addSpirit(-6); }),
    o(`"Fair enough! Any yard work or projects we could help with? No strings — we just like to be useful."`, 'serve'),
  ]),
  engage: n(h, `He raises an eyebrow, then actually engages — Mountain Meadows, the translation process, polygamy. You answer what you can, and admit what you don't know.\n"Huh. You're allowed to say 'I don't know'? That's new."`, [
    o(`"Faith isn't pretending to know everything. It's acting on what we do know."`, 'respect', ()=>{ h.interest+=8; addSpirit(2); }),
  ]),
  common: n(h, `He softens slightly. "I believe in... data. And my kids. And that people should be decent to each other without needing a cosmic reward." He shrugs. "You two seem decent. Misallocated, but decent."`, [
    o(`"Decent to each other is most of our message, honestly. The rest we'd love to discuss any time you're curious."`, 'respect', ()=>{ h.interest+=6; }),
  ]),
  debate: n(h, `Twenty minutes of cross-examination later, nobody has moved an inch and everyone's voice is slightly raised. "Well. This has been pointless," he says, and shuts the door.\nElder Sorensen exhales. "Contention isn't of the Spirit, Elder. We never argue people into the kingdom."`, [
    o(`(Walk it off.)`, 'END', ()=>{ tc(20); h.rejectedUntil=day+3; bump('convos'); }),
  ]),
  serve: n(h, `He squints, suspicious of free labor. "...The fence gate's been broken since March. If this is a trick, it's a weird one."\nIt is not a trick. You fix the gate.`, [
    o(`(An hour of honest work.)`, 'served', ()=>{ tc(45); bump('service'); addSpirit(6); h.interest+=14; h.served=true; }),
  ]),
  served: n(h, `He tests the gate twice, almost smiles. "Okay. I'm not praying about any books. But if you're ever back this way... I make a decent lemonade." That, from Greg Marsh, is a baptism of its own.`, [
    o(`"Deal. See you around, Greg."`, 'END', ()=>{ bump('convos'); h.stage='friendly'; }),
  ]),
}});

TREES.christian = h => ({ start:'a', nodes:{
  a: n(h, `A silver-haired woman with a cross necklace opens the door, already smiling kindly. "Oh, you sweet boys. I'm sorry you came all this way — I've been Baptist for sixty years and I love my Lord and my church."`, [
    o(`"That's wonderful! Tell us about your church — what do you love most about following Christ?"`, 'common', ()=>{ h.interest+=8; addSpirit(2); }),
    o(`"We love Him too — that's the whole reason we're here. Our message is actually ABOUT Jesus Christ."`, 'about', ()=>{ h.interest+=5; }),
    o(`"But did you know your church is missing the restored priesthood authority?" (correct her)`, 'bash', ()=>{ addSpirit(-8); }),
  ]),
  common: n(h, `She tells you about her choir, her grandkids' baptisms, the casseroles her congregation carried her through chemo with. You listen, and mean it.\n"And what is it you boys believe? In one sentence — I know how young men sermonize."`, [
    o(`"That Jesus Christ leads His church today, through a living prophet — same as in the Bible."`, 'gift', ()=>{ h.interest+=6; }),
  ]),
  about: n(h, `"Is it now." She studies your name tags — 'The Church of JESUS CHRIST of Latter-day Saints' — like she's reading it for the first time. "Well, He's right there in the name, I'll grant you that."`, [
    o(`Share your testimony of the Savior, simply.`, 'gift', ()=>{ h.interest+=6; addSpirit(2); }),
  ]),
  bash: n(h, `The kindness doesn't leave her face, but the warmth does. "Young man, I was singing hymns before your parents met. I'll pray for your safe travels." The door closes gently, which somehow makes it worse.\nElder Sorensen shakes his head. "We build on common ground. We never tear down someone else's faith."`, [
    o(`(Lesson learned.)`, 'END', ()=>{ h.rejectedUntil=day+3; bump('convos'); }),
  ]),
  gift: n(h, `She pats your arm. "You're good boys. I'm not changing churches at my age — but leave me that Book of Mormon. I read everything about Jesus, and I'll read this too. Fair?"`, [
    o(`"More than fair. Start with 3 Nephi — He visits the Americas after His resurrection. We think you'll love it."`, 'END', ()=>{ h.bom=true; bump('boms'); bump('convos'); h.stage='friendly'; addSpirit(3); }),
  ]),
}});

TREES.lessactive = h => ({ start:'a', nodes:{
  a: n(h, `A man in his fifties opens the door and freezes when he sees the tags. "...Elders." He says the word like an old photograph. "I grew up in the Church. Haven't been since... well. A long time."`, [
    o(`"We're glad we found you, Brother Olsen. What happened, if you don't mind us asking?"`, 'story', ()=>{ h.interest+=8; addSpirit(2); }),
    o(`"Then you know exactly why we knock doors! The ward would love to have you back Sunday."`, 'fastinvite', ()=>{ h.interest+=2; }),
  ]),
  story: n(h, `He tells it slowly: a divorce nobody knew how to talk about, a comment in a hallway that stuck like a splinter, and then twenty years of Sundays that were just easier at home. "Nobody came, you know. After. Until you two."`, [
    o(`"I'm sorry no one came. We're here now — and the sacrament is about Him, not the hallway."`, 'invite', ()=>{ h.interest+=10; addSpirit(3); }),
    o(`Sit with him a minute and let him talk. Then ask if you can share a scripture about the Savior leaving the ninety-nine.`, 'invite', ()=>{ h.interest+=12; addSpirit(3); }),
  ]),
  fastinvite: n(h, `He half-smiles. "Straight to the point. You sound like my mission companion — I served in Chile, you know. A thousand years ago." The memory does something to his face. "Let me think about it."`, [
    o(`"Can we come think about it WITH you? Tomorrow, maybe?"`, 'invite', ()=>{ h.interest+=6; }),
  ]),
  invite: n(h, `"Church starts at ten, right? Same building?" He rubs the back of his neck. "If I came... would you two sit with me? It's been a while since I knew where to sit."`, [
    o(`"Front-ish, left side, right next to us. We'll save you a seat, Brother Olsen."`, 'END', ()=>{ h.churchCommit=true; h.stage='friendly'; h.interest+=10; bump('convos'); addSpirit(4); }),
  ]),
}});

TREES.hostile = h => ({ start:'a', nodes:{
  a: n(h, `The door jerks open on a chain. "Oh, you have GOT to be kidding me. I've got a NO SOLICITING sign, I've told your church to take me off the list TWICE—"`, [
    o(`"You're right, and we're sorry. We'll make a note. Have a good evening, sir."`, 'polite', ()=>{ addSpirit(2); h.polite=true; }),
    o(`"We're not soliciting, sir, we're sharing a message—" (press on)`, 'slam', ()=>{ addSpirit(-5); }),
    o(`"Before we go — anything we can ever help with? Yard, gutters, anything. No message attached."`, 'huff'),
  ]),
  polite: n(h, `He blinks — braced for an argument that didn't come. "...Yeah. Fine." The door shuts, but quietly.\nElder Sorensen shrugs. "Some doors aren't ready. We leave them better than we found them."`, [
    o(`(On to the next door.)`, 'END', ()=>{ h.rejectedUntil=day+3; }),
  ]),
  slam: n(h, `"THAT'S WHAT SOLICITING IS!" The door slams hard enough to rattle the wreath on the neighbor's door. From inside: muffled, ongoing commentary about clipboards and Sunday mornings.`, [
    o(`(Retreat with dignity.)`, 'END', ()=>{ h.rejectedUntil=day+5; }),
  ]),
  huff: n(h, `A long pause through the chain gap. "...No." Another pause. "The gutters are fine." A third pause. "...Who does gutters for free?" The door closes, but you can feel him thinking about it.`, [
    o(`(Seed planted. Maybe.)`, 'END', ()=>{ h.rejectedUntil=day+2; h.polite=true; h.interest+=5; }),
  ]),
}});
TREES.hostileSoft = h => ({ start:'a', nodes:{
  a: n(h, `Randall Pike opens the door — no chain this time. "You two again." He scratches his jaw. "...You were polite, last time. The Jehovah's Witnesses argue. The solar panel guys lie. You just... left." A grunt. "Gutters could use a look. NO preaching."`, [
    o(`"No preaching. Just gutters." (Spend an hour serving him.)`, 'b', ()=>{ tc(50); bump('service'); addSpirit(6); h.interest+=15; }),
    o(`"We'd love to. And we'll keep the preaching at zero."`, 'b', ()=>{ tc(50); bump('service'); addSpirit(5); h.interest+=12; }),
  ]),
  b: n(h, `An hour later the gutters are clean and Randall has silently produced two glasses of water, which for Randall Pike is a sermon. "...There's pie sometimes. On Saturdays." That's all you get, and it's a lot.`, [
    o(`"Saturdays. Noted, Mr. Pike."`, 'END', ()=>{ h.stage='friendly'; bump('convos'); }),
  ]),
}});

TREES.elderly = h => ({ start:'a', nodes:{
  a: n(h, `The door opens before you finish knocking. A tiny white-haired woman beams up at you. "Oh! Visitors! Come in, come in— well, stay on the porch, I know your rules, my grandson served in Japan. Sit! I have lemon bars."`, [
    o(`Sit on the porch swing and let her talk. (This will take a while.)`, 'chat', ()=>{ tc(25); h.interest+=10; addSpirit(3); }),
    o(`"We'd love to, but just briefly — we have a message about God's plan for families."`, 'brief', ()=>{ h.interest+=5; }),
    o(`"Before anything else — is there anything around the house we can do for you?"`, 'serve'),
  ]),
  chat: n(h, `Forty minutes, two lemon bars, and one complete history of the neighborhood later, you know about her late husband Gerald, her hip, and which neighbors wave back. "You're the first souls to sit on that swing since Gerald." She says it lightly, which is how you know it's heavy.`, [
    o(`"Then we'll be back. And next time, we'd love to share a message about Gerald — about where he is, and seeing him again."`, 'hook', ()=>{ h.interest+=12; addSpirit(2); }),
  ]),
  brief: n(h, `"Families! Yes, sit down and tell me — but eat a lemon bar first, you're both too thin, the Lord didn't make you to be skipping meals on my porch."`, [
    o(`(Resistance is futile. Eat the lemon bar.)`, 'hook', ()=>{ h.interest+=8; addSpirit(2); }),
  ]),
  serve: n('narr', `She has A List. The porch light bulb, a jar that won't open, a photo of Gerald to re-hang. You work through it while she narrates each item's life story.`, [
    o(`(Finish The List.)`, 'hook', ()=>{ tc(30); bump('service'); addSpirit(5); h.interest+=14; h.served=true; }),
  ]),
  hook: n(h, `"Gerald used to say church folks only visit with a casserole or an agenda." She pats the swing. "You two come back with neither, and I'll listen to any message you like."`, [
    o(`"Tomorrow afternoon, then. Porch swing. No casserole."`, 'END', ()=>{ h.stage='appt'; h.apptDay=day+1; bump('appts'); bump('convos'); bump('friends'); }),
  ]),
}});

TREES.member = h => ({ start:'a', nodes:{
  a: n(h, `The door swings wide. "ELDERS!" Brother Halverson is already pulling you inside. "Honey, set two more plates! You're not vegetarians, are you? Doesn't matter, there's three meats."`, [
    o(`Stay for dinner. (Missionaries run on member dinners.)`, 'dinner', ()=>{ tc(55); addSpirit(8); h.dinnerDay=day; }),
    o(`"We'd love to, but we're working a tight schedule — could we share a quick message and ask a favor instead?"`, 'msg'),
  ]),
  dinner: n(h, `Funeral potatoes. Jell-O with shredded carrots in it, which Sister Halverson dares you to enjoy. Their kids make you re-enact your worst door approach. It's the warmest hour of your week.`, [
    o(`Share a brief spiritual thought before you go, and ask: "Who do you know that we should visit?"`, 'referral'),
  ]),
  msg: n(h, `"A favor? Elders, you fed my nephew in Ohio for two years. Ask away."`, [
    o(`"Who in this neighborhood could use a visit — or a plate of cookies with two weirdos in ties attached?"`, 'referral'),
  ]),
  referral: n(h, `They trade a look. "Marge Ipson, on the corner — widow, sharp as a tack, lonely as anything. And honestly? The Whitfield boy. He lost his sister this spring. Tell them the Halversons sent you — that'll get you past the porch."`, [
    o(`"We'll see them this week. Thank you — for everything."`, 'END', ()=>{ giveReferrals(['elderly','seeker']); bump('convos'); addSpirit(3); }),
  ]),
}});
function giveReferrals(archs) {
  for (const a of archs) {
    const h = houses.find(x => x.arch === a);
    if (h && !h.baptized) { h.referred = true; h.interest += 15; }
  }
}

TREES.newmove = h => ({ start:'a', nodes:{
  a: n(h, `A man answers, surrounded by a fortress of moving boxes. Two kids peek around his legs. "Hello! Sorry — we are buried alive. We moved from Sacramento on Friday. You are... from a church, yes? The name tags."`, [
    o(`"We are — and we're also two free pairs of hands. Want help with those boxes?"`, 'serve'),
    o(`"Welcome to the neighborhood! We're missionaries — we'd love to tell you about the community AND our church."`, 'welcome', ()=>{ h.interest+=6; }),
  ]),
  serve: n('narr', `Ninety minutes of boxes, a disassembled bunk bed defeated at last, and a crash course in cricket from the kids. Mrs. Patel insists you take samosas. You do not resist.`, [
    o(`(Best workout this week.)`, 'after', ()=>{ tc(70); bump('service'); addSpirit(7); h.interest+=16; h.served=true; }),
  ]),
  welcome: n(h, `"Ah — missionaries! In Sacramento the Latter-day Saints helped us move IN. Is this a service your church provides nationally?" He's joking, mostly. "We are Hindu, but we like good neighbors of every kind."`, [
    o(`"Good neighbors is the core doctrine, honestly. Can we help with those boxes?"`, 'serve'),
  ]),
  after: n(h, `"You worked like family. So — as family — be honest. The message you carry door to door. What is it, in one minute? I am curious what makes young men give up two years."`, [
    o(`Give the one-minute version: God speaks again, through a living prophet, and families are forever.`, 'close', ()=>{ h.interest+=8; addSpirit(2); }),
    o(`"It's about Jesus Christ — but it keeps better over dinner. Maybe once you're unpacked?"`, 'close', ()=>{ h.interest+=6; }),
  ]),
  close: n(h, `He nods slowly. "Interesting. We will not convert, I think — but we will feed you, and we will listen. In our house these are not small things." He shakes your hands. "Come back when the boxes are gone."`, [
    o(`"Count on it. Thanks for the samosas, Mr. Patel."`, 'END', ()=>{ h.stage='friendly'; bump('convos'); }),
  ]),
}});

TREES.nothome = h => ({ start:'a', nodes:{
  a: n('narr', `You knock. Nothing. Knock again. A wind chime answers, unhelpfully. The Tanners, per the mailbox, are not home.`, [
    o(`Leave a pass-along card with a note: "Sorry we missed you! —The missionaries"`, 'END', ()=>{ h.cardLeft=true; bump('cards'); }),
    o(`Note the address to try again another day.`, 'END'),
  ]),
}});
TREES.nothomeBack = h => ({ start:'a', nodes:{
  a: n(h, `A tired-looking nurse in scrubs answers, holding your rained-on card from the porch mat. "You left this? I work nights — you're the first people to knock in months who weren't selling pest control."`, [
    o(`"Just neighbors with a message about Christ — and flexible hours. When do night-shift people take visitors?"`, 'b', ()=>{ h.interest+=8; }),
    o(`"Sorry to wake you! We can come another time."`, 'c'),
  ]),
  b: n(h, `She almost laughs. "Four PM. I'm human at four PM." She taps the card. "My grandma had one of your Books of Mormon. I always meant to ask someone about it."`, [
    o(`"Four PM tomorrow, then. We'll bring you your own copy."`, 'END', ()=>{ h.stage='appt'; h.apptDay=day+1; bump('appts'); bump('convos'); bump('friends'); }),
  ]),
  c: n(h, `"No, it's— it's actually kind of nice. Being knocked for, not at." She waves the card. "I'll call the number if I get a day off, okay?"`, [
    o(`"Any time. Get some sleep!"`, 'END', ()=>{ bump('convos'); h.interest+=5; }),
  ]),
}});

// friendly repeat visits (non-investigators you've won over)
TREES.friendly = h => ({ start:'a', nodes:{
  a: n(h, `${RES[h.arch].name.split(' ')[0]} waves from the door. You catch up for a few minutes — no agenda, just neighbors now. ${h.churchCommit ? 'They mention they\'re still planning on church Sunday.' : ''}`, [
    o(`Invite them to church on Sunday.`, 'inv', null, ()=>!h.churchCommit),
    o(`Ask if they'd be open to hearing the missionary lessons sometime.`, 'less', null, ()=>h.interest>=55 && !h.dropped),
    o(`Just wish them well and move on.`, 'END', ()=>{ addSpirit(1); }),
  ]),
  inv: n(h, persuadeText(h, 60), 'END', ()=>{ if (persuade(45,h)) { h.churchCommit=true; addSpirit(3); } }),
  less: n(h, `"You know what... alright. One lesson. Mostly because you fixed the ${h.served?'thing you fixed':'afternoon'}." They smile. "Come by tomorrow."`, [
    o(`"Tomorrow it is!"`, 'END', ()=>{ h.stage='appt'; h.apptDay=day+1; bump('appts'); bump('friends'); }),
  ]),
}});
function persuadeText(h){ return `They consider it. "Sunday... maybe. No promises — but maybe." (Sometimes maybe is enough.)`; }

// -------- expanded town: new residents --------
TREES.veteran = h => ({ start:'a', nodes:{
  a: n(h, `An older man in a KOREA VETERAN cap answers, standing parade-straight. He reads both name tags fully before speaking. "Missionaries. My Ruthie used to feed your kind meatloaf every fall. She passed two years back." He says it like a weather report, which is how you know it isn't.`, [
    o(`"Thank you for your service, Mr. Garrison. Tell us about Ruthie — was she the religious one?"`, 'ruthie', ()=>{ h.interest+=12; addSpirit(2); }),
    o(`"We're sorry for your loss. Our message is actually about where Ruthie is now."`, 'direct', ()=>{ h.interest+=6; }),
    o(`"That flag bracket's hanging loose, sir. Mind if we square it away while we're here?"`, 'serve'),
  ]),
  ruthie: n(h, `He talks for ten minutes — Ruthie's hymn-humming, her Bible with the cracked spine, how the house got quiet wrong after. "She'd have liked you two. She liked anybody who showed up." He clears his throat with military efficiency.`, [
    o(`"We believe Ruthie's not gone, sir — just early to the reunion. We'd love to show you why we're sure."`, 'hook', ()=>{ h.interest+=10; addSpirit(3); }),
  ]),
  direct: n(h, `His jaw works. "That's a big claim, son. Men have sold me a lot of things at this door." A pause. "But none of them mentioned Ruthie first. Go on."`, [
    o(`Briefly teach that families can be sealed forever — death doesn't get the last word.`, 'hook', ()=>{ h.interest+=8; }),
  ]),
  serve: n('narr', `Fifteen minutes, one borrowed screwdriver, and a properly squared flag bracket later, Walt inspects the work like a drill sergeant and finds nothing to correct. This visibly costs him.`, [
    o(`"All set, sir."`, 'hook', ()=>{ tc(15); bump('service'); addSpirit(4); h.interest+=10; h.served=true; }),
  ]),
  hook: n(h, `"...Thursday," he says finally. "I'll dig out Ruthie's Bible. If your book contradicts it, you'll hear about it." He almost smiles. "She'd want me to feed you. There will be meatloaf. It will not be as good as hers."`, [
    o(`"Thursday, sir. We'll bring our appetites and our scriptures."`, 'END', ()=>{ h.stage='appt'; h.apptDay=day+1; bump('appts'); bump('convos'); bump('friends'); }),
  ]),
}});

TREES.teen = h => ({ start:'a', nodes:{
  a: n(h, `A teenager answers, one earbud in, skateboard under his arm. "Uh. Hi? Mom and Dad are at work till six." He squints at your tags. "Are you guys like... door-to-door pastors?"`, [
    o(`"Close! But we'd need a parent home to visit properly — that's our rule. Could you give them this card?"`, 'card', ()=>{ addSpirit(1); }),
    o(`"Sort of! Mind if we share a quick message with you right now?"`, 'stop'),
    o(`"Missionaries. Nice board — is that setup good for street or park?"`, 'skate', ()=>{ h.interest+=8; }),
  ]),
  stop: n(CO, `Elder Sorensen catches your eye and steps in smoothly: "—which we'd love to do when your mom or dad is home. We don't teach minors without a parent around." (Right. Missionary standard: a parent or guardian present, always.)`, [
    o(`"Exactly. Could you pass this card along to your folks?"`, 'card'),
  ]),
  card: n(h, `Dakota takes the card and studies it. "Sure, whatever." Then, unable to help himself: "Is it true you guys can't play video games for like TWO YEARS? Bro. BRO. I'd die."`, [
    o(`"Two years. We get letters, naps on Mondays, and the occasional miracle. It's a trade."`, 'END', ()=>{ bump('cards'); bump('convos'); h.stage='friendly'; h.interest+=5; }),
  ]),
  skate: n(h, `Fifteen minutes of skate talk later — he demonstrates an ollie off the porch step, you do not attempt one in slacks — Dakota has decided you're acceptable humans. "Mom's home Saturdays. She's into church stuff. Dad will hide in the garage, fair warning."`, [
    o(`"Saturday then — all of you, garage dwellers included. We teach families, not just moms."`, 'END', ()=>{ tc(12); h.stage='appt'; h.apptDay=day+2; bump('appts'); bump('convos'); bump('friends'); }),
  ]),
}});

TREES.newlyweds = h => ({ start:'a', nodes:{
  a: n(h, `A young couple answers together, mid-argument about where the couch should go. Wedding cards are still taped around the doorframe. "Hi! Sorry — we got married three weeks ago and the couch is testing us," the woman says. "I'm Jess. This is Tyler. Tyler is wrong about the couch."`, [
    o(`"Congratulations! Quick professional opinion: couch against the long wall. Also — we have a message about marriages that outlast couches. And everything else."`, 'hook', ()=>{ h.interest+=8; addSpirit(1); }),
    o(`"Congratulations! Want two extra sets of hands on that couch?"`, 'serve'),
  ]),
  serve: n('narr', `The couch goes against the long wall (Jess was right), the bookcase goes up the stairs (everyone loses), and you learn they met in a pottery class neither meant to sign up for.`, [
    o(`(Good work. Good people.)`, 'hook', ()=>{ tc(25); bump('service'); addSpirit(4); h.interest+=10; h.served=true; }),
  ]),
  hook: n(h, `"Okay, pitch us," Tyler says, flopping onto the correctly-placed couch. "Newlyweds. Three weeks in. What's your message got for us?"`, [
    o(`"In our temples, marriages aren't 'till death do you part' — they're sealed forever. Death doesn't end what you two started three weeks ago."`, 'resp', ()=>{ h.interest+=10; addSpirit(2); }),
    o(`"Mostly? That God wanted you two to find that pottery class."`, 'resp', ()=>{ h.interest+=8; }),
  ]),
  resp: n(h, `Jess and Tyler do the silent married-couple-conference thing — three weeks in and they've already got it. "Forever, huh," Jess says. "Okay. Come back when the boxes are gone. We'll feed you something that isn't wedding cake."`, [
    o(`"Deal. Congratulations again — couch looks great."`, 'END', ()=>{ h.stage='appt'; h.apptDay=day+2; bump('appts'); bump('convos'); bump('friends'); }),
  ]),
}});

TREES.spanish = h => ({ start:'a', nodes:{
  a: n(h, `A grandmother opens the door, takes one look at the name tags, and lights up. "¡Misioneros! Pásenle, pásenle—" She calls back into the house in rapid Spanish. Your two semesters of high-school Spanish assemble for duty and immediately desert.`, [
    o(`Attempt Spanish: "¡Hola! Somos... misioneros... de la Iglesia de... Jesucristo..."`, 'attempt', ()=>{ addSpirit(2); }),
    o(`Smile, accept whatever is happening, and let Elder Sorensen try — he prepped for a Spanish-speaking call.`, 'sorensen'),
  ]),
  attempt: n(h, `Abuela Morales pats your arm encouragingly, the way one praises a toddler's drawing. Her granddaughter appears, laughing: "She says your accent is 'muy valiente.' Very brave. That's not a compliment."`, [
    o(`(Accept your fate. And the pan dulce she is now pressing into your hands.)`, 'offer'),
  ]),
  sorensen: n(CO, `Elder Sorensen produces careful, earnest Spanish — slow but real. Abuela beams and corrects his conjugations between sentences. A granddaughter translates the parts everyone gives up on. There is suddenly pan dulce in your hands. Neither of you saw it arrive.`, [
    o(`(This family is wonderful.)`, 'offer', ()=>{ addSpirit(2); }),
  ]),
  offer: n(ME, `"Señora — our church has Spanish-speaking missionaries, and a Spanish branch that meets across town. Could we send the hermanas to visit? They teach in Spanish, and they're much better company than we are."`, [
    o(`(She's already nodding before the translation finishes.)`, 'close', ()=>{ bump('appts'); bump('convos'); h.interest+=10; }),
  ]),
  close: n(h, `Phone numbers are exchanged, a visit is arranged, and Abuela Morales blesses you both in Spanish at length — the granddaughter translates only "she says you're too skinny." You leave with more pan dulce than you arrived with hands for.`, [
    o(`"¡Gracias! ¡Hasta luego!"`, 'END', ()=>{ h.stage='friendly'; h.spanishSent=true; addSpirit(3); }),
  ]),
}});
TREES.spanishAgain = h => ({ start:'a', nodes:{
  a: n(h, h.spanishSent
    ? `Abuela Morales waves you up to the porch. The granddaughter translates: "The hermanas came Tuesday! Abuela made them eat twice. They're teaching us about—" she checks a pamphlet "—the Plan of Salvation. Abuela says you two get credit in heaven for the referral, but the hermanas teach better." Accurate on all counts.`
    : `The Morales family waves from the porch. There is, inevitably, pan dulce.`, [
    o(`"¡Excelente! Tell her the hermanas are the best in the mission."`, 'END', ()=>{ addSpirit(2); }),
  ]),
}});

TREES.faithcrisis = h => ({ start:'a', nodes:{
  a: n(h, `A woman in her forties opens the door, sees the tags, and her face does several careful things at once. "Elders." A beat. "I should tell you before you start — I resigned my membership three years ago. Formally. Letter and everything." She doesn't close the door, though.`, [
    o(`"Thank you for telling us. We're not here to re-convert you — but we'd listen, if you ever wanted to tell someone how you got here."`, 'listen', ()=>{ h.interest+=8; addSpirit(2); }),
    o(`"Can I share one scripture that might—"`, 'fix', ()=>{ addSpirit(-5); }),
    o(`"Understood. Can we still be useful to you as neighbors? No agenda."`, 'kind', ()=>{ addSpirit(2); }),
  ]),
  listen: n(h, `She studies you both for a long moment, then leans against the doorframe and tells it plainly — the questions that wouldn't resolve, the meetings that got harder, the relief and the grief of leaving, "because nobody warns you it's both."\n"You're the first missionaries who didn't flinch," she says. "They usually flinch."`, [
    o(`"It sounds like you made that decision carefully, and it cost you. We're not going to argue with your pain."`, 'close', ()=>{ h.interest+=8; addSpirit(3); }),
    o(`"What do you wish people from the church understood?"`, 'wish', ()=>{ h.interest+=10; addSpirit(3); }),
  ]),
  wish: n(h, `"That I didn't leave to sin, and I didn't leave because I was offended, and I'm not coming back if they just find the right casserole." She laughs, a little wet. "That I'm still a good person. That my mom can stop crying about it." She wipes her eyes briskly. "Sorry. You asked a real question. Haven't had one in a while."`, [
    o(`"For what it's worth — you seem like exactly as good a person as you were four years ago."`, 'close', ()=>{ addSpirit(2); }),
  ]),
  fix: n(h, `She holds up a hand — not unkind, but final. "Elder. I taught Gospel Doctrine for six years. There is no scripture you have that I haven't taught." The door starts to close. "Tell your mission president the exit interviews need work."`, [
    o(`(That went how it deserved to.)`, 'END', ()=>{ h.rejectedUntil=day+4; bump('convos'); }),
  ]),
  kind: n(h, `Something in her shoulders comes down an inch. "Neighbors. Huh." She considers. "My fence gate sticks. And nobody's asked me to anything without a lesson attached in three years."`, [
    o(`(Fix the gate. Attach no lesson.)`, 'close', ()=>{ tc(20); bump('service'); addSpirit(4); h.interest+=10; h.served=true; }),
  ]),
  close: n(h, `"You two can knock here any time," she says finally. "Not for lessons. For lemonade. There's a difference and I think you actually get it." From Naomi Pratt, this is a stained-glass window of a compliment.`, [
    o(`"Lemonade it is. Take care, Naomi."`, 'END', ()=>{ h.stage='friendly'; bump('convos'); }),
  ]),
}});

TREES.jw = h => ({ start:'a', nodes:{
  a: n(h, `The door opens on two men in suits holding literature — you've knocked on the home base of the local Jehovah's Witnesses mid-departure. All four of you freeze, name tags to name tags, like rival samurai.\n"...Well," says the taller one. "Awkward."`, [
    o(`"Gentlemen. How's the territory treating you?"`, 'shop', ()=>{ addSpirit(2); }),
    o(`"We'd trade you a Book of Mormon for a Watchtower, but I think we both know how that ends."`, 'trade'),
  ]),
  shop: n(h, `Professional courtesy breaks out instantly. Bill and Tom pull no punches on shop talk: worst slammed door (theirs involved a garden hose), best month (April, always April), the house on Cedar that yells (you compare notes — same house). "Twenty years I've knocked doors," Bill says. "You LDS boys are the only ones who wave back."`, [
    o(`"Door-knockers' union. We should get jackets."`, 'close', ()=>{ bump('convos'); }),
  ]),
  trade: n(h, `Tom actually laughs. "Straight to the literature exchange. Bold." They decline, you decline, everyone nods respectfully at the symmetry. "You know neither of us is converting the other," Bill says, "so — coffee? No wait. You can't. Lemonade?"`, [
    o(`"Lemonade works. Ten minutes — then we've both got doors."`, 'close', ()=>{ bump('convos'); addSpirit(2); }),
  ]),
  close: n(h, `Ten minutes of lemonade diplomacy later, you part with firm handshakes and mutual professional respect. "Stay hydrated out there, elders," Tom says. "Tell the house on Cedar we said nothing."`, [
    o(`"Your secret's safe. Happy knocking, gentlemen."`, 'END', ()=>{ h.stage='friendly'; tc(10); }),
  ]),
}});
TREES.jwAgain = h => ({ start:'a', nodes:{
  a: n(h, `Bill and Tom are loading pamphlets into their car. They give you the solemn two-finger salute of fellow professionals. "Elders." "Gentlemen." Nothing more needs saying.`, [
    o(`(Return the salute.)`, 'END', ()=>{ addSpirit(1); }),
  ]),
}});

TREES.eternal = h => ({ start:'a', nodes:{
  a: n(h, `The door opens before your knuckles land. "ELDERS! Right on schedule!" A round, delighted man waves you in. "Charlie Bingham. I've been fed every set of missionaries since aught-six. Elder Tanaka, Elder Briggs, the one who juggled— sit, sit, the lemon water's already poured." It is. Two glasses. He knew.`, [
    o(`"You've heard the lessons before, haven't you, Charlie."`, 'all', ()=>{ h.interest+=4; }),
    o(`Sit. Drink the lemon water. See where this goes.`, 'chat', ()=>{ tc(15); }),
    o(`"Charlie — twenty years of missionaries. Can I ask you the real question? What's actually keeping you?"`, 'real', ()=>{ addSpirit(2); }),
  ]),
  all: n(h, `"Heard them? Son, I can TEACH them. Restoration, Plan of Salvation, the Word of Wisdom — quiz me." He recites the First Vision from memory, word-perfect, with feeling. "Elder Briggs cried when I did that. Wonderful boy. Terrible juggler."`, [
    o(`"...Then why haven't you ever been baptized, Charlie?"`, 'real'),
  ]),
  chat: n(h, `An hour evaporates. Charlie knows every missionary's hometown, every mission president since the Clinton administration, and the entire ward by casserole signature. He is, you realize, the best-taught unbaptized man in the state.`, [
    o(`"Charlie. The real question. What's keeping you?"`, 'real'),
  ]),
  real: n(h, `The twinkle goes out of him like a tide. He turns the lemon water glass in a slow circle. "...My brother was excommunicated in '98. Nobody visited HIM after. Not once. I decided I'd keep you all close enough to love and far enough to never be dropped." He looks up. "Twenty years, son. You're the first one who asked."`, [
    o(`"Charlie — come to church Sunday. Not for the lessons. Sit with us. Let them see you walk in the door your brother should've been walked back through."`, 'resp', ()=>{ h.interest+=12; addSpirit(3); }),
    o(`Sit with that for a moment. Then just put a hand on his shoulder.`, 'resp2', ()=>{ addSpirit(3); h.interest+=8; }),
  ]),
  resp: n(h, `A very long pause. "...One Sunday," Charlie says at last, quietly, like a man stepping off a dock he's stood on for twenty years. "ONE. And if anyone asks, I'm there for the casseroles."`, [
    o(`"For the casseroles. Obviously. We'll save you a seat, Charlie."`, 'END', ()=>{ h.churchCommit=true; h.stage='friendly'; bump('convos'); }),
  ]),
  resp2: n(h, `He pats your hand twice, briskly, and refills lemon water nobody asked for. "Next set of elders that comes through," he says, not looking at you, "you tell them Charlie's question got asked." You will. You absolutely will.`, [
    o(`(Some doors take twenty years. Keep knocking this one.)`, 'END', ()=>{ h.stage='friendly'; bump('convos'); }),
  ]),
}});
TREES.eternalAgain = h => ({ start:'a', nodes:{
  a: n(h, h.churchCommit
    ? `Charlie's already got the lemon water poured. "Sunday's still on," he says before you ask. "ONE Sunday. Casseroles. We're agreed." He's ironed a shirt. It's hanging on the door where he can see it.`
    : `Charlie waves you in for lemon water and mission gossip. He's heard about your week from three separate ward members. He always does.`, [
    o(`(Charlie Bingham, you magnificent fixture.)`, 'END', ()=>{ tc(10); addSpirit(2); }),
  ]),
}});

TREES.farmer = h => ({ start:'a', nodes:{
  a: n(h, `At the last house before the fields, a weathered man in a seed cap is fighting a tarp in the wind, losing 2-1. He spots you. "Either grab that corner or keep walking, church boys — rain's coming and this hay won't cover itself."`, [
    o(`Grab the corner. Ask questions later.`, 'work'),
    o(`"We'll do you one better — point us at the hay."`, 'work', ()=>{ addSpirit(1); }),
  ]),
  work: n('narr', `An hour of real work: tarp wrestled, hay covered, one bungee cord sacrificed to the wind gods. By the end your white shirts are archaeology. Hal surveys the job, then you, then produces a thermos and two tin cups on the tailgate.`, [
    o(`(Tailgate. Lemonade. Earned.)`, 'tail', ()=>{ tc(50); bump('service'); addSpirit(6); h.interest+=14; h.served=true; }),
  ]),
  tail: n(h, `"My granddad got baptized Mormon in '51," Hal says to the horizon, apropos of nothing. "Up in Idaho. Never told nobody why, never went back, never said a word against it neither. Carried that little book in the truck till he died." He sips. "Always did wonder what got into him."`, [
    o(`"We could tell you exactly what got into him, Hal. It'd take about forty-five minutes and another tailgate."`, 'hook', ()=>{ h.interest+=8; }),
    o(`"Want to find out? We've got a copy of that little book in the bag right now."`, 'bom', ()=>{ }),
  ]),
  hook: n(h, `Hal considers the clouds, the hay, and sixty-some years of wondering. "Thursday. Weather holds, we talk after chores. Weather don't, you're moving hay first." Both outcomes, you suspect, are the plan.`, [
    o(`"Thursday, Hal. We'll bring work gloves AND scriptures."`, 'END', ()=>{ h.stage='appt'; h.apptDay=day+1; bump('appts'); bump('convos'); bump('friends'); }),
  ]),
  bom: n(h, `He takes the Book of Mormon and turns it over with tarp-roughened hands, the same way his granddad must have. "Huh. Lighter than it looks." It goes on the dash of the truck, right where the last one rode. "Maybe I'll see what the old man saw."`, [
    o(`"Start anywhere. We'll be back to hear about it."`, 'END', ()=>{ h.bom=true; bump('boms'); bump('convos'); h.stage='friendly'; h.interest+=6; }),
  ]),
}});

TREES.musician = h => ({ start:'a', nodes:{
  a: n(h, `The door opens on a man in a dressing gown and last night's eyeliner, holding coffee the size of a planter. "It is NOON," he rasps. "I got off stage at two AM. This better be a noise complaint, because at least that'd be a compliment."`, [
    o(`"Sorry for the hour! What do you play?"`, 'music', ()=>{ h.interest+=8; }),
    o(`"We're missionaries — we can come back at a musician-friendly hour. Four PM? Five?"`, 'later', ()=>{ addSpirit(1); }),
  ]),
  music: n(h, `"Keys, mostly. Some organ when a venue's weird enough to have one." Elder Sorensen perks up dangerously. "Our chapel has an organ," he says. "A good one. Barely anyone can play it."\nRev's eyebrows conduct a brief negotiation with each other. "...A real organ. Pipes?"`, [
    o(`"Pipes. Sundays it mostly plays hymns at one-third speed. It deserves better. Come see it."`, 'organ', ()=>{ h.interest+=10; }),
  ]),
  later: n(h, `"Five PM. You knock at five, I'm a completely different person. Practically a churchgoer." He toasts you with the enormous coffee and shuts the door gently.`, [
    o(`(Note: return at five. Bring earplugs, maybe.)`, 'END', ()=>{ h.stage='appt'; h.apptDay=day+1; bump('appts'); bump('convos'); }),
  ]),
  organ: n(h, `"Okay, here's the thing," Rev says, suddenly awake. "I will come look at your organ. I will possibly play your organ. I am NOT promising to absorb doctrine while doing it." He pauses. "Although my nana always said the organ was halfway to heaven anyway."`, [
    o(`"Door's open Sunday — organ's in the chapel, doctrine's optional, nana sounds wise."`, 'END', ()=>{ if (persuade(55,h)) h.churchCommit=true; h.stage='friendly'; bump('convos'); addSpirit(2); }),
  ]),
}});

TREES.partyhouse = h => ({ start:'a', nodes:{
  a: n(h, `The door is opened by a guy in a tank top, mid-yell over his shoulder: "PAUSE IT, KEGAN, I SWEAR—" Inside: four roommates, a couch of archaeological significance, and a very loud video game. He blinks at you. "...Oh dang. The Mormon guys. Uh. We're good? Probably?"`, [
    o(`"Thirty-second version, then we're gone: God still speaks. There's a free book involved. We do service too — even dishes."`, 'pitch'),
    o(`"We can come back when it's quieter. Does quieter... happen here?"`, 'quiet'),
  ]),
  pitch: n(h, `You deliver the thirty seconds over explosion sounds. Tank Top Guy nods along charitably. But you notice it — in the kitchen doorway, one roommate has stopped, dish towel frozen, actually listening. He's still standing there when the others drift back to the game.`, [
    o(`Catch his eye: "Got a minute?"`, 'marcus'),
  ]),
  quiet: n(h, `"Quieter happens at like... 2 AM? Or finals week." He shrugs apologetically. As the door swings, a roommate with a dish towel slips out onto the porch behind it. "Hey— wait up a sec."`, [
    o(`(Wait up.)`, 'marcus'),
  ]),
  marcus: n(h, `He pulls the door mostly shut behind him, muffling the game. "Marcus. Sorry about the guys." He works the dish towel in his hands. "My grandma's LDS. Tucson. She's been... she's sick, and she keeps saying she's not scared, and I can't tell if I believe her or if I just really want to." He looks up. "Is that the kind of thing you guys actually talk about? Or is it all just... the book?"`, [
    o(`"That's EXACTLY what we talk about. The book's just where it's written down. When are you free, Marcus?"`, 'appt', ()=>{ h.interest+=12; addSpirit(3); }),
    o(`"Your grandma's not scared because she knows something. We can show you what."`, 'appt', ()=>{ h.interest+=10; addSpirit(2); }),
  ]),
  appt: n(h, `"Tuesdays the guys have intramurals. House is dead quiet." He half-smiles for the first time. "Don't tell Kegan. He'll make it weird." Behind the door, on cue: muffled Kegan noises.`, [
    o(`"Tuesday. Quiet house. Kegan-free zone. We'll be here, Marcus."`, 'END', ()=>{ h.stage='appt'; h.apptDay=day+1; bump('appts'); bump('convos'); bump('friends'); }),
  ]),
}});

TREES.bishop = h => ({ start:'a', nodes:{
  a: n(h, `Bishop Diaz opens the door still in his work boots, and his wife is already pulling a third and fourth plate down before the door's fully open. "Elders! Perfect timing — Sister Diaz made arroz con pollo and the kids are at mutual. Sit. Report. How's our town treating the Lord's errand boys?"`, [
    o(`Stay for dinner and report on the area honestly — the doors, the wins, the slams.`, 'dinner', ()=>{ tc(50); addSpirit(8); h.dinnerDay=day; }),
    o(`"Can't stay long, Bishop — but we'd love your counsel. Who needs us?"`, 'counsel'),
  ]),
  dinner: n(h, `Over arroz con pollo, the bishop listens the way bishops do — fully, fork down. He laughs at the door stories, goes quiet at the right ones. "You're doing it right," he says finally. "Doors are the math. People are the mission."`, [
    o(`"Bishop — who in this town needs a knock that we wouldn't know about?"`, 'counsel'),
  ]),
  counsel: n(h, `He exchanges a look with Sister Diaz. "Two names. Naomi Pratt — she resigned, and that's hers to hold, but nobody's been KIND to her since. No lessons, elders. Just be good to her." A pause. "And Walt Garrison. Lost his wife. He'll growl. Growl back politely — Ruthie was the best ward organist we ever had."`, [
    o(`"Naomi and Walt. Kindness first, doctrine if invited. We're on it, Bishop."`, 'END', ()=>{ giveReferrals(['faithcrisis','veteran']); bump('convos'); addSpirit(4); }),
  ]),
}});

TREES.scientist = h => ({ start:'a', nodes:{
  a: n(h, `A woman answers with a red pen behind her ear and a stack of lab reports under one arm. "Ah. Missionaries." She says it with taxonomic precision, like she's identifying a species. "Dr. Okafor. Cell biology. I have forty unmarked papers and, apparently, a moment of curiosity. You have five minutes. Impress me."`, [
    o(`"Five minutes — then we'll trade: one scripture that's basically an experimental protocol. Alma 32. Plant the idea like a seed, observe what grows."`, 'alma', ()=>{ h.interest+=10; }),
    o(`"What does a cell biologist make of faith, if you don't mind the personal question?"`, 'faith', ()=>{ h.interest+=8; addSpirit(1); }),
  ]),
  alma: n(h, `She actually takes the Book of Mormon and reads Alma 32 standing in the doorway, red pen twitching. "...Huh. 'Give place, that a seed may be planted... if it be a true seed... it will begin to swell.' That's a falsifiable design. Hypothesis, trial, observed result." She looks up. "Did a farmer write this?"`, [
    o(`"A prophet, around 74 BC. The experiment's still open for replication. Keep the book — consider it lab equipment."`, 'close', ()=>{ h.bom=true; bump('boms'); h.interest+=8; }),
  ]),
  faith: n(h, `She considers the question with the seriousness it deserved. "I study machinery so elegant it makes me suspicious," she says at last. "And my mother in Enugu prays like breathing and is the sanest person I know. So: undecided, leaning intrigued. That's the honest answer."`, [
    o(`"Undecided-leaning-intrigued is our favorite demographic. Can we leave you the book and come argue about epistemology sometime?"`, 'close', ()=>{ h.bom=true; bump('boms'); h.interest+=8; }),
  ]),
  close: n(h, `"You may return," Dr. Okafor rules, already re-shouldering her papers. "After finals week. Bring your best evidence and your thickest skins — I peer-review everything." The door closes on what is unmistakably a smile.`, [
    o(`"Peer review accepted. Good luck with the marking!"`, 'END', ()=>{ h.stage='friendly'; bump('convos'); }),
  ]),
}});

TREES.critic = h => ({ start:'a', nodes:{
  a: n(h, `A guy in his late twenties answers, phone in hand, and his eyes light up with the particular joy of a man who has Done His Research. "Oh-ho. Okay. Okay okay okay. I have watched literally forty hours of documentaries about you guys. Seed money. The translation hat. 1978. Go ahead — do the pitch. I'm ready."`, [
    o(`"Sounds like you know the gotchas. Have you ever read the actual sources — Joseph's own account, the Book of Mormon itself — or just the commentary?"`, 'sources', ()=>{ h.interest+=8; }),
    o(`"Forty hours! That's more study than most members. What kept you watching?"`, 'why', ()=>{ h.interest+=8; addSpirit(2); }),
    o(`Rebut every claim, point by point, from memory.`, 'brawl', ()=>{ addSpirit(-6); }),
  ]),
  sources: n(h, `He opens his mouth. Closes it. "...The commentary," he admits. "I mean, the documentaries QUOTE the sources." You offer the comparison gently: reading reviews of a restaurant versus eating there. "Okay, that's— hm." He hates how reasonable that is. You can see him hating it.`, [
    o(`"Here's the primary source. Read ten pages, keep your skepticism on. Then tell us what the documentaries got wrong — or right. We'll take either."`, 'close', ()=>{ h.bom=true; bump('boms'); h.interest+=6; }),
  ]),
  why: n(h, `The question catches him flat. "What KEPT me—" He frowns at his phone. "...I don't know, man. My ex was a member. She was the kindest person I ever dated and I keep trying to figure out if the church made her like that or if she was like that despite it." Oh. There it is. There's always a there-it-is.`, [
    o(`"That's a better question than anything in the documentaries. Want help working on it?"`, 'close', ()=>{ h.interest+=8; addSpirit(2); }),
  ]),
  brawl: n(h, `Ninety minutes later you know his YouTube subscriptions by heart, he knows your rebuttals by heart, and nobody knows anything new. Elder Sorensen has aged visibly. "We never argue people into the kingdom, Elder," he says on the sidewalk, "but congratulations — you've argued us out of an afternoon."`, [
    o(`(An expensive lesson in contention.)`, 'END', ()=>{ tc(60); h.rejectedUntil=day+3; bump('convos'); }),
  ]),
  close: n(h, `"This is a trick," Devin says, taking the book anyway. "This is some reverse-psychology missionary jiu-jitsu." He's already thumbing to the first page. "I'm going to fact-check EVERYTHING." Honestly? Perfect. Moroni's promise was written for exactly this man.`, [
    o(`"Fact-check away. Moroni 10:4 is the methodology section."`, 'END', ()=>{ h.stage='friendly'; bump('convos'); }),
  ]),
}});

// pedestrians
function pedTree(p) {
  if (p.kind === 'dogwalker') return { start:'a', nodes:{
    a: n(p, `A golden retriever decides you are its new best friend. Its human laughs. "Biscuit, heel— Biscuit. BISCUIT." She gives up. "Sorry. You're the missionaries, right? I see you two everywhere."`, [
      o(`"That's us! Can we ask — who in the neighborhood should we visit? You clearly know everyone."`, 'tip'),
      o(`Pet Biscuit. Talk about dogs. Be a human first.`, 'dog', ()=>{ addSpirit(2); }),
    ]),
    dog: n(p, `Five minutes of quality dog time later: "You know who'd love Biscuit? Marge, on the corner. She's alone too much. You should knock there — tell her Pat sent you."`, [
      o(`"We will. Thanks, Pat. Bye, Biscuit."`, 'END', ()=>{ giveReferrals(['elderly']); bump('convos'); }),
    ]),
    tip: n(p, `"Hmm — Marge Ipson, corner house. Widowed, sweet, bakes when she's lonely, and she's ALWAYS baking lately." She tugs the leash. "Tell her Pat sent you."`, [
      o(`"On our way. Thanks!"`, 'END', ()=>{ giveReferrals(['elderly']); bump('convos'); }),
    ]),
  }};
  if (p.kind === 'jogger') return { start:'a', nodes:{
    a: n(p, `A jogger slows, pulls out one earbud, points at your name tag, and pants: "Saw... you guys... at the... corner. You're out here... every day?"`, [
      o(`"Every day, rain or shine! Here — card has a free Book of Mormon and our number. No cardio required."`, 'b'),
      o(`"Every day! Don't let us slow you down — have a great run!"`, 'c', ()=>{ addSpirit(1); }),
    ]),
    b: n(p, `He takes the card with two sweaty fingers. "Respect... the hustle." He pockets it and jogs on. You may have just placed the world's dampest pass-along card.`, [
      o(`(Every card counts.)`, 'END', ()=>{ bump('cards'); bump('convos'); }),
    ]),
    c: n(p, `He gives a thumbs up and accelerates. Somewhere in the rhythm of his shoes you choose to hear "I'll-think-about-God, I'll-think-about-God."`, [ o(`(Onward.)`, 'END') ]),
  }};
  if (p.kind === 'mailcarrier') return { start:'a', nodes:{
    a: n(p, `The mail carrier sorts a fistful of envelopes without breaking stride. "Elders. I deliver your church magazines to half this town — I know your members before YOU do." She taps a stack. "Professional tip, free of charge?"`, [
      o(`"Yes please. You're the best-informed person on this route."`, 'tip'),
      o(`"Only if we can trade — anything we can carry for you?"`, 'tip', ()=>{ addSpirit(2); }),
    ]),
    tip: n(p, `"Number 69, north row — newlyweds. I've delivered forty wedding cards and a bread maker this month. New couples are nesting; nesting people answer doors." She's already walking. "You didn't hear it from the federal government."`, [
      o(`"Heard from nobody. Thanks, Ines!"`, 'END', ()=>{ giveReferrals(['newlyweds']); bump('convos'); }),
    ]),
  }};
  if (p.kind === 'skater') return { start:'a', nodes:{
    a: n(p, `A kid rockets past on a skateboard, loops back, and circles you both like a shark in cargo shorts. "Yo. You're the tie guys. My friend Dakota said you're chill." He kickflips, lands it, looks expectant.`, [
      o(`Applaud the kickflip. Offer a card: "Free book, wild story — golden plates, an angel, the works."`, 'card'),
      o(`"Dakota said we're chill? Tell him the feeling's mutual."`, 'chill'),
    ]),
    card: n(p, `"Golden plates? Buried? And an angel guards them?" He takes the card and reads it upside down, then right side up. "That's lowkey the most metal origin story I've ever heard." He pockets it and rolls off, narrating it to himself.`, [
      o(`(The Restoration: officially lowkey metal.)`, 'END', ()=>{ bump('cards'); bump('convos'); }),
    ]),
    chill: n(p, `"Knew it." He fist-bumps you both — Elder Sorensen's form is improving — and rockets away, yelling back over his shoulder: "DAKOTA SAYS COME SATURDAY, HIS MOM'S MAKING A CAKE!"`, [
      o(`(Intel received. Cake confirmed.)`, 'END', ()=>{ bump('convos'); addSpirit(1); }),
    ]),
  }};
  if (p.kind === 'stroller') return { start:'a', nodes:{
    a: n(p, `A mom makes slow, deliberate laps with a stroller, pointing at the occupant with the universal expression of "if you wake this baby we are all dead." She mouths: "Twenty more minutes and she's down for real."`, [
      o(`(Whisper) "We'll be quick. The ward has a playgroup Wednesdays — moms, babies, free snacks, zero sermons."`, 'play'),
      o(`Give a silent thumbs up and a wide, respectful berth.`, 'berth', ()=>{ addSpirit(1); }),
    ]),
    play: n(p, `Her eyes say what her voice can't risk: tell me more. You hand over a card with the time written on it. "Free snacks?" she breathes. "And adults? Who talk?" She clutches it like scripture, which Wednesday at 10 AM basically is for new moms.`, [
      o(`(Whisper) "Wednesdays. Ten. Tell them the elders sent you."`, 'END', ()=>{ bump('cards'); bump('convos'); }),
    ]),
    berth: n(p, `She gives you a grateful nod of profound depth. As you pass, she whispers: "You two are the only people this week who didn't ring my doorbell during nap time. God sees you." High praise. Possibly literal.`, [
      o(`(Tiptoe onward.)`, 'END'),
    ]),
  }};
  return { start:'a', nodes:{
    a: n(p, `A man in a work badge checks his watch as you approach. "Let me guess — two minutes about Jesus? I've got ninety seconds and a bus."`, [
      o(`"Deal. Ninety seconds." Give the fastest, warmest version of the Restoration you've got.`, 'b', ()=>{ addSpirit(2); }),
      o(`"We'll trade you — bus schedule small talk, no sermon."`, 'c'),
    ]),
    b: n(p, `You stick the landing at eighty-eight seconds. He blinks. "That was... actually pretty good." The bus arrives. "Keep the streak going, elders." He takes a card as he boards.`, [
      o(`(Eighty-eight seconds!)`, 'END', ()=>{ bump('cards'); bump('convos'); }),
    ]),
    c: n(p, `You talk about the 14 bus's crimes against punctuality. He nods goodbye as it arrives — no message shared, but no door closed either.`, [ o(`(Next time.)`, 'END') ]),
  }};
}

// ============================================================
// THE LESSONS (Preach My Gospel chapters 3.1–3.5, condensed)
// ============================================================
const LESSONS = [
  { title:'Lesson 1 — The Restoration of the Gospel of Jesus Christ',
    body:`You teach the pattern: God is our loving Heavenly Father. He calls prophets — Noah, Moses — and people drift away, and He reaches out again. After Christ and His Apostles died, that priesthood authority was lost: the Great Apostasy.\n\nThen, spring of 1820 — a 14-year-old named Joseph Smith, confused by competing churches, read James 1:5 ("If any of you lack wisdom, let him ask of God") and went to the woods to pray.`,
    key:`You recite the First Vision, the way you've come to love saying it: "I saw a pillar of light exactly over my head, above the brightness of the sun... When the light rested upon me I saw two Personages... One of them spake unto me, calling me by name, and said, pointing to the other — THIS IS MY BELOVED SON. HEAR HIM!"\n\nThe room is very quiet. The Spirit is doing the part you can't.` },
  { title:'Lesson 2 — The Plan of Salvation',
    body:`Where did I come from? Why am I here? Where do I go after this life?\n\nYou teach: we lived with God before birth as His spirit children. Earth life is a school — we gain a body, we're tested, we learn to choose. Because of the Fall, we face sin and death; because of Jesus Christ's Atonement, both can be overcome.`,
    key:`You teach about what comes next: at death our spirits go to the spirit world — the faithful to paradise, all still learning, still loved. Then resurrection for everyone, a gift from Christ, and judgment, and kingdoms of glory.\n\nFor someone who has lost a person they love, this lesson is not doctrine. It's oxygen.` },
  { title:'Lesson 3 — The Gospel of Jesus Christ',
    body:`The doctrine of Christ, in five movements: FAITH in the Lord Jesus Christ — enough to act. REPENTANCE — change, made possible by His Atonement, available for the rest of your life. BAPTISM by immersion, by one holding priesthood authority, the way Jesus Himself was baptized in the Jordan.`,
    key:`Then the GIFT OF THE HOLY GHOST by the laying on of hands — a constant companion, not a visitor. And ENDURING TO THE END, which mostly means: keep going, keep covenant, take the sacrament weekly and start again.\n\nThis is the lesson where missionaries extend the invitation that matters most.` },
  { title:'Lesson 4 — The Commandments',
    body:`Keeping commandments isn't the price of God's love — it's how we make room for it. You walk through them: pray daily, as a family and alone. Keep the Sabbath day holy. Follow the prophet. The Ten Commandments. Honesty. The law of tithing — a tenth, given back.`,
    key:`Then the Word of Wisdom — the Lord's law of health from 1833: no alcohol, tobacco, coffee, or tea; treat the body as a temple. And the law of chastity. These are the lessons where real life shows up with questions.` },
  { title:'Lesson 5 — Laws and Ordinances; Preparing for Baptism',
    body:`The home stretch. You review the baptismal questions together — the same ones the district leader will ask in the baptismal interview: faith in Christ, repentance, willingness to keep the commandments and serve.`,
    key:`You describe the service itself: white clothing, the font, the exact prayer said with authority, full immersion — a burial of the old life and a birth of a new one. Then confirmation and the gift of the Holy Ghost, given in sacrament meeting.\n\nIt's close now. You can feel it.` },
];

function lessonTree(h) {
  const L = LESSONS[h.lessons];
  const ln = h.lessons + 1;
  const name = RES[h.arch].name.split(' ')[0];
  const porch = h.arch === 'elderly';
  const nodes = {};
  nodes.a = n('narr', `${porch
    ? `You teach Marge on the porch swing — she lives alone, so per missionary guidelines you stay outside. She's draped a quilt over the railing and set out lemon bars. "My chapel," she says, patting the swing.`
    : `${name} welcomes you in. You say an opening prayer together, follow up on last time, and open to the lesson.`}\n\n${L.title}`, [
      o(`(Begin teaching.)`, 'b', ()=>{ tc(20); }),
  ]);
  nodes.b = n(ME, L.body, [ o(`(Continue.)`, 'how') ]);
  nodes.how = n('narr', `${name} is listening. How do you teach the heart of it?`, [
    o(`Ask an inspired question: "As we share this — what are YOU feeling?"`, 'key', ()=>{ h.interest+=8; addSpirit(2); }),
    o(`Bear simple, personal testimony.`, 'key', ()=>{ h.interest+=6; addSpirit(3); }),
    o(`Read the scripture together and let them read aloud.`, 'key', ()=>{ h.interest+=7; }),
    o(`Cover ALL the doctrine, fast, while you have the chance.`, 'firehose', ()=>{ h.interest-=6; }),
  ]);
  nodes.firehose = n(CO, `(Elder Sorensen gently puts a hand on your arm mid-paragraph and asks ${name} a question instead. Later, outside, he says it kindly: "We teach people, not lessons, Elder.")`, [ o(`(He's right.)`, 'key') ]);
  nodes.key = n(ME, L.key, [ o(`(Continue.)`, 'special') ]);

  // per-lesson special beats
  if (ln === 1) {
    nodes.special = n('me2', `You place a Book of Mormon in ${name}'s hands. "This is the keystone of our message. Will you read it — starting with the introduction and Moroni 10:4–5 — and ask God, in the name of Christ, if it's true? He WILL answer you."`, [
      o(`(Promise the blessing and wait for the answer.)`, 'resp1', ()=>{ if(!h.bom){h.bom=true;bump('boms');} }),
    ]);
    nodes.resp1 = n(h, persuade(70,h)
      ? `${name} turns the book over slowly. "...Yeah. Okay. I'll read it. And I'll ask." (Commitment accepted!)`
      : `${name} hesitates. "I'll... look at it. No promises on the praying part." (Partial commitment — follow up next time.)`, [ o(`(Continue.)`, 'church') ],
      ()=>{ if (persuade(0,h)) {} });
  } else if (ln === 2) {
    nodes.special = n(h, h.arch==='seeker'
      ? `Sam is quiet for a long moment. "So my sister... she's not just gone. She's somewhere. Learning. Waiting." His voice does something complicated. "And I could actually see her again."`
      : `${name} sits back. "So this life isn't the whole story. There's a before, and an after, and a point to the middle."`, [
      o(`"That's the plan. That's why it's called the plan of HAPPINESS." Testify of it.`, 'church', ()=>{ h.interest+=10; addSpirit(3); }),
    ]);
  } else if (ln === 3) {
    nodes.special = n(ME, `You take a breath. This is the one. "${name} — will you follow the example of Jesus Christ by being baptized by someone holding the priesthood authority of God? We can help you prepare for a baptismal service in the coming weeks."`, [
      o(`(Wait. Let the Spirit do its work.)`, 'bapresp'),
    ]);
    nodes.bapresp = n(h, null, [ o(`(Continue.)`, 'church') ], ()=>{
      if (h.interest >= 62) {
        nodes.bapresp.text = `The pause stretches. Then ${name} nods — first slowly, then like something has settled. "...Yes. Yeah. I want that."\n\nElder Sorensen is grinning at his shoes. You set a date.\n\n*** BAPTISMAL DATE SET ***`;
        if (!h.bapDate) { h.bapDate = true; bump('bapDates'); addSpirit(8); }
      } else {
        nodes.bapresp.text = `${name} exhales. "That's... a big step. I'm not there yet. Keep teaching me?"\n\n("Not yet" is not "no," Elder Sorensen reminds you on the walk out. You'll extend the invitation again.)`;
        h.interest += 3;
      }
    });
  } else if (ln === 4) {
    nodes.special = n(h, `When you reach the Word of Wisdom, ${name} stops you. "Hold on. Coffee? You're coming after my COFFEE? Elders, I have a relationship with coffee. We have history."`, [
      o(`Laugh with them, then promise the real blessing: "Thousands give it up every year — and God makes up the difference. We'll check in and help."`, 'wow1', ()=>{ h.interest+=8; addSpirit(2); }),
      o(`"It's not optional if you want to be baptized." (Lay down the law.)`, 'wow2', ()=>{ h.interest-=8; addSpirit(-3); }),
    ]);
    nodes.wow1 = n(h, `${name} groans theatrically, then eyes the mug on the counter like it's a rival. "...Fine. FINE. Decaf as a transition is allowed? Don't answer that. I'll do it."`, [ o(`(Continue.)`, 'church') ]);
    nodes.wow2 = n(CO, `The room cools a few degrees. Elder Sorensen smooths it over with a story about his own dad quitting smoking one prayer at a time. (Commandments are invitations, not ultimatums — you'll remember that.)`, [ o(`(Continue.)`, 'church') ]);
  } else {
    nodes.special = n(h, `${name} reads through the baptismal interview questions and looks up. "I can answer these. All of them. Honestly... when did THAT happen?"\n\n"Somewhere between the first knock and now," Elder Sorensen says.`, [
      o(`(Almost there.)`, 'church', ()=>{ h.interest+=6; }),
    ]);
  }

  nodes.church = n(ME, h.churchCommit
    ? `You confirm the plan for Sunday — sacrament meeting at ten, you'll save a seat.`
    : `"${name}, will you come to church with us this Sunday? Sacrament meeting is at ten — we'll sit with you, and warn you about every hymn in advance."`, [
    o(h.churchCommit ? `(Sunday's on.)` : `(Invite, promise, follow up.)`, 'pray', ()=>{
      if (!h.churchCommit && persuade(55,h)) { h.churchCommit = true; addSpirit(3); }
    }),
  ]);
  nodes.pray = n('narr', `You close the lesson. Who offers the prayer?`, [
    o(`Invite ${name} to say it — their first out-loud prayer ${ln===1?'maybe ever':'in a while'}.`, 'done', ()=>{ h.interest+=7; addSpirit(3); }),
    o(`Elder Sorensen offers a warm, simple prayer.`, 'done', ()=>{ h.interest+=3; addSpirit(1); }),
  ]);
  nodes.done = n('narr', `Lesson ${ln} taught. ${h.churchCommit ? 'They\'re planning on church Sunday. ' : ''}You set a return appointment for tomorrow and step back out into the day.\n\n(Interest: ${'★'.repeat(Math.round((h.interest||0)/20))}${'☆'.repeat(Math.max(0,5-Math.round((h.interest||0)/20)))})`, [
    o(`(Press on.)`, 'END', ()=>{
      tc(25); h.lessons++; h.taughtDay = day; bump('lessons'); addSpirit(4);
      h.stage = 'investigator'; h.apptDay = day + 1;
      if (h.interest < 38) { h.dropped = true; h.stage = 'friendly'; }
      if (h.lessons >= 5 && h.bapDate && h.attended) h.pendingBaptism = true;
      if (h.lessons >= 5 && !(h.bapDate && h.attended)) h.finishing = true;
    }),
  ]);
  return { start:'a', nodes };
}

TREES.investigatorWait = h => ({ start:'a', nodes:{
  a: n(h, h.dropped
    ? `${RES[h.arch].name.split(' ')[0]} answers, a little sheepish. "Hey, elders. I've been thinking... this isn't for me right now. I'm sorry. You two are great, though." (Not every seed sprouts today. You part as friends.)`
    : (h.taughtDay === day
      ? `You already taught ${RES[h.arch].name.split(' ')[0]} today. "Tomorrow!" they call through the door. "I have homework, apparently! Five hundred pages of it!"`
      : `${RES[h.arch].name.split(' ')[0]} waves you in — they were expecting you.`), [
    o(`(Okay.)`, 'END', ()=>{ if (h.dropped) h.stage='friendly'; }),
  ]),
}});

TREES.baptizedMember = h => ({ start:'a', nodes:{
  a: n(h, `${RES[h.arch].name.split(' ')[0]} answers the door with a grin and — you notice — scripture marking pencils on the table behind them. "Elders! I was just doing my reading. Moroni 10 still gets me." Some doors you knock once; some you get to walk through for the rest of your life.`, [
    o(`(Gratitude. Just — gratitude.)`, 'END', ()=>{ addSpirit(2); }),
  ]),
}});

TREES.rejected = h => ({ start:'a', nodes:{
  a: n('narr', h.polite
    ? `You skip this door for now — they asked for space, and respecting that IS the message.`
    : `The curtains twitch. The door does not open. Message received.`, [ o(`(Move along.)`, 'END') ]),
}});

// church building
function churchTree() { return { start:'a', nodes:{
  a: n('narr', `The chapel — clean brick, a steeple with no cross (you've explained why a hundred times: the focus is the living Christ). The sign reads:\n\nTHE CHURCH OF JESUS CHRIST OF LATTER-DAY SAINTS\nSacrament Meeting — Sunday 10:00 AM\nVISITORS WELCOME\n\n${houses.some(h=>h.churchCommit&&!h.baptized) ? 'Friends planning to attend Sunday: ' + houses.filter(h=>h.churchCommit&&!h.baptized).map(h=>RES[h.arch].name).join(', ') : 'No friends committed for Sunday yet. Keep inviting!'}`, [
    o(`(Say a quiet prayer of thanks and keep working.)`, 'END', ()=>{ addSpirit(3); }),
  ]),
}};}

