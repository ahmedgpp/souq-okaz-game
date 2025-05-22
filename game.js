
class IntroScene extends Phaser.Scene {
  constructor() {
    super("IntroScene");
  }
  preload() {
      this.load.image('introBg', 'https://i.imgur.com/W4kPq67.png');
  }
  create() {
    this.add.image(400, 300, 'introBg').setScale(1.2);

      this.add.text(400, 100, "مغامرة في سوق عكاظ", {
      fontSize: '48px',
      fill: '#ebe7e4',
      fontStyle: 'bold',
      fontFamily: 'Cairo',
      stroke: '#000',
      strokeThickness: 5,
    }).setOrigin(0.5);

    this.add.text(400, 160, "في أرض الجاهلية القديمة\nالبحث عن الكنز والعرش العظيم", {
      fontSize: '24px',
      fill: '#ebe7e4',
      fontStyle: 'italic',
      align: 'center',
      fontFamily: 'Cairo',
    }).setOrigin(0.5);

    const startBtn = this.add.text(400, 400, "ابدأ المغامرة", {
      fontSize: '36px',
      backgroundColor: '#8b4513',
      padding: { x: 25, y: 15 },
      fill: '#fff',
      fontFamily: 'Cairo',
      fontWeight: '700',
      stroke: '#000',
      strokeThickness: 3,
      borderRadius: 10,
    }).setOrigin(0.5).setInteractive();

    startBtn.on('pointerdown', () => {
      this.scene.start('MarketScene', { health: 100, score: 0, skills: { horse: 0, eloquence: 0, wisdom: 0 } });
    });

    this.add.text(400, 550, "   سوق عكاظ  ", {
      fontSize: '16px',
      fill: '#ebe7e4',
      align: 'center',
      fontFamily: 'Cairo',
    }).setOrigin(0.5);
  }
}

class MarketScene extends Phaser.Scene {
  constructor() {
    super("MarketScene");
  }
  preload() {
    this.load.image('marketBg', 'https://i.imgur.com/GTHBCEG.jpg');
    this.load.image('btn', 'https://i.imgur.com/7hYYeX0.png');
  }
  create(data) {
    this.health = data.health;
    this.score = data.score;
    this.skills = data.skills || { horse: 0, eloquence: 0, wisdom: 0 };

    this.add.image(400, 300, 'marketBg').setDisplaySize(800, 600);

    // واجهة الصحة والنقاط والمهارات
    this.healthText = this.add.text(20, 20, `الصحة: ${this.health}`, { fontSize: '22px', fill: '#fff', fontFamily: 'Cairo' });
    this.scoreText = this.add.text(650, 20, `النقاط: ${this.score}`, { fontSize: '22px', fill: '#fff', fontFamily: 'Cairo' });

    this.skillsText = this.add.text(400, 20,
      `مهارات - فروسية: ${this.skills.horse} | بلاغة: ${this.skills.eloquence} | حكمة: ${this.skills.wisdom}`,
      { fontSize: '18px', fill: '#ffffaa', fontFamily: 'Cairo' }).setOrigin(0.5, 0);

    this.add.text(400, 80, "أنت في سوق عكاظ، ماذا تريد أن تفعل؟", { fontSize: '30px', fill: '#fff', fontFamily: 'Cairo' }).setOrigin(0.5);

    // خيارات السوق المتقدمة
    const options = [
      { text: "مبارزة شعرية", action: () => this.startPoetryBattle() },
      { text: "مبارزة بالسيف", action: () => this.startSwordBattle() },
      { text: "استكشاف السوق", action: () => this.exploreMarket() },
      { text: "تدريب المهارات", action: () => this.trainSkills() },
      { text: "الذهاب إلى النهاية الكبرى", action: () => this.goFinalChallenge() },
    ];

    options.forEach((opt, i) => {
      const btn = this.add.text(400, 150 + i * 55, opt.text, {
        fontSize: '26px',
        fill: '#fff',
        backgroundColor: '#6b8e23',
        padding: { x: 10, y: 5 },
        fontFamily: 'Cairo',
        fontWeight: '700',
        stroke: '#000',
        strokeThickness: 2,
        borderRadius: 5,
      }).setOrigin(0.5).setInteractive();

      btn.on('pointerdown', () => opt.action());
    });
  }

  startPoetryBattle() {
    this.scene.start('PoetryBattleScene', {
      health: this.health,
      score: this.score,
      skills: this.skills
    });
  }

  startSwordBattle() {
    this.scene.start('SwordBattleScene', {
      health: this.health,
      score: this.score,
      skills: this.skills
    });
  }

  exploreMarket() {
    // احتمالية أحداث متنوعة
    const eventChance = Phaser.Math.Between(1, 100);

    if (eventChance <= 40) {
      this.score += 30;
      alert('وجدت كنزًا صغيرًا في السوق! +30 نقاط');
    } else if (eventChance <= 75) {
      this.health -= 15;
      if (this.health <= 0) {
        this.scene.start('GameOverScene', { score: this.score });
        return;
      }
      alert('تعرضت لإصابة أثناء الاستكشاف! -15 ');
    } else {
      // حدث خاص: العثور على كتاب حكمة يرفع المهارات
      this.skills.wisdom += 1;
      this.score += 20;
      alert('وجدت كتاب حكمة قديم! حكمة +1، نقاط +20');
    }
    this.scene.restart({ health: this.health, score: this.score, skills: this.skills });
  }

  trainSkills() {
    this.scene.start('TrainSkillsScene', { health: this.health, score: this.score, skills: this.skills });
  }

  goFinalChallenge() {
    if (this.score >= 150 && this.skills.horse >= 2 && this.skills.eloquence >= 2 && this.skills.wisdom >= 2) {
      this.scene.start('FinalChallengeScene', { health: this.health, score: this.score, skills: this.skills });
    } else {
      alert('لم تحقق الشروط للذهاب إلى النهاية الكبرى. تحتاج نقاط ومهارات أعلى.');
    }
  }
}

// مشهد تدريب المهارات
class TrainSkillsScene extends Phaser.Scene {
  constructor() {
    super('TrainSkillsScene');
  }
  create(data) {
    this.health = data.health;
    this.score = data.score;
    this.skills = data.skills || { horse: 0, eloquence: 0, wisdom: 0 };

    this.add.rectangle(400, 300, 800, 600, 0x333300, 1);

    this.add.text(400, 80, 'تدريب المهارات', {
      fontSize: '36px',
      fill: '#fff',
      fontFamily: 'Cairo',
    }).setOrigin(0.5);

    this.add.text(400, 130, `النقاط المتاحة: ${this.score}`, { fontSize: '28px', fill: '#ffd700', fontFamily: 'Cairo' }).setOrigin(0.5);

    // عرض المهارات الحالية
    const skillNames = ['horse', 'eloquence', 'wisdom'];
    const skillLabels = ['فروسية', 'بلاغة', 'حكمة'];
    this.buttons = [];

    skillNames.forEach((skill, i) => {
      this.add.text(300, 200 + i * 70, `${skillLabels[i]}: ${this.skills[skill]}`, {
        fontSize: '26px',
        fill: '#fff',
        fontFamily: 'Cairo',
      });

      const btn = this.add.text(500, 200 + i * 70, 'تدريب (+10 نقاط)', {
        fontSize: '24px',
        fill: '#fff',
        backgroundColor: '#228b22',
        padding: { x: 10, y: 5 },
        fontFamily: 'Cairo',
        fontWeight: '700',
        stroke: '#000',
        strokeThickness: 2,
        borderRadius: 5,
      }).setInteractive();

      btn.on('pointerdown', () => {
        if (this.score >= 10) {
          this.score -= 10;
          this.skills[skill]++;
          this.scene.restart({ health: this.health, score: this.score, skills: this.skills });
        } else {
          alert('لا توجد نقاط كافية للتدريب.');
        }
      });

      this.buttons.push(btn);
    });

    // زر العودة
    const backBtn = this.add.text(400, 520, 'عودة إلى السوق', {
      fontSize: '28px',
      fill: '#fff',
      backgroundColor: '#8b0000',
      padding: { x: 30, y: 15 },
      fontFamily: 'Cairo',
      fontWeight: '700',
      stroke: '#000',
      strokeThickness: 3,
      borderRadius: 7,
    }).setOrigin(0.5).setInteractive();

    backBtn.on('pointerdown', () => {
      this.scene.start('MarketScene', { health: this.health, score: this.score, skills: this.skills });
    });
  }
}

// مشهد المبارزة الشعرية
class PoetryBattleScene extends Phaser.Scene {
  constructor() {
    super('PoetryBattleScene');
  }
  create(data) {
    this.health = data.health;
    this.score = data.score;
    this.skills = data.skills;

    this.add.rectangle(400, 300, 800, 600, 0x552200, 1);

    this.add.text(400, 50, 'مبارزة شعرية', {
      fontSize: '40px',
      fill: '#fff',
      fontFamily: 'Cairo',
    }).setOrigin(0.5);

    // أبيات جاهلية جاهزة (يمكن التوسع لاحقاً)
    this.poems = [
      {
        line: "هل غادر الشعراء من متردم؟",
        options: ["نعم، لقد غادروا", "لا، لا يزالون هنا", "الشعراء لم يرحلوا أبداً"],
        correct: 2,
        effect: { eloquence: 1, score: 20 }
      },
      {
        line: "وكلُّ امرئٍ يُوْهَنُ عِندَ نَائِبِهِ",
        options: ["حقًا، يجب أن نصبر", "يحتاج إلى الحكمة", "الصبر هو الحل"],
        correct: 1,
        effect: { wisdom: 1, score: 15 }
      }
    ];

    this.currentPoem = 0;
    this.showPoem();
  }

  showPoem() {
    if (this.currentPoem >= this.poems.length) {
      alert('انتهت المبارزة الشعرية بنجاح!');
      this.scene.start('MarketScene', { health: this.health, score: this.score, skills: this.skills });
      return;
    }
    const poem = this.poems[this.currentPoem];
    if (this.questionText) this.questionText.destroy();
    if (this.optionsTexts) this.optionsTexts.forEach(t => t.destroy());

    this.questionText = this.add.text(400, 150, poem.line, {
      fontSize: '28px',
      fill: '#ffffaa',
      fontFamily: 'Cairo',
      wordWrap: { width: 700 }
    }).setOrigin(0.5);

    this.optionsTexts = [];
    poem.options.forEach((opt, i) => {
      const txt = this.add.text(400, 250 + i * 50, opt, {
        fontSize: '24px',
        fill: '#fff',
        backgroundColor: '#6a4c93',
        padding: { x: 10, y: 5 },
        fontFamily: 'Cairo',
        fontWeight: '700',
        stroke: '#000',
        strokeThickness: 2,
        borderRadius: 5,
      }).setOrigin(0.5).setInteractive();

      txt.on('pointerdown', () => this.handleAnswer(i));
      this.optionsTexts.push(txt);
    });
  }

  handleAnswer(index) {
    const poem = this.poems[this.currentPoem];
    if (index === poem.correct) {
      this.score += poem.effect.score;
      this.skills.eloquence += poem.effect.eloquence || 0;
      this.skills.wisdom += poem.effect.wisdom || 0;
      alert("إجابة صحيحة! نقاط ومهارات ارتفعت.");
    } else {
      this.health -= 10;
      alert("إجابة خاطئة! خسرت  .");
      if (this.health <= 0) {
        this.scene.start('GameOverScene', { score: this.score });
        return;
      }
    }
    this.currentPoem++;
    this.showPoem();
  }
}

// مشهد المبارزة بالسيف
class SwordBattleScene extends Phaser.Scene {
  constructor() {
    super('SwordBattleScene');
  }
  create(data) {
    this.health = data.health;
    this.score = data.score;
    this.skills = data.skills;

    this.add.rectangle(400, 300, 800, 600, 0x440000, 1);

    this.add.text(400, 50, 'مبارزة بالسيف', {
      fontSize: '40px',
      fill: '#fff',
      fontFamily: 'Cairo',
    }).setOrigin(0.5);

    this.enemyHealth = 50 + this.skills.horse * 10;
    this.playerTurn = true;

    this.healthText = this.add.text(50, 100, `صحتك: ${this.health}`, { fontSize: '26px', fill: '#fff', fontFamily: 'Cairo' });
    this.enemyHealthText = this.add.text(550, 100, `صحة الخصم: ${this.enemyHealth}`, { fontSize: '26px', fill: '#fff', fontFamily: 'Cairo' });

    this.infoText = this.add.text(400, 400, 'اختار هجومك أو دفاعك', {
      fontSize: '28px',
      fill: '#ffd700',
      fontFamily: 'Cairo'
    }).setOrigin(0.5);

    this.attackBtn = this.add.text(250, 500, 'هجوم', {
      fontSize: '32px',
      fill: '#fff',
      backgroundColor: '#b22222',
      padding: { x: 40, y: 20 },
      fontFamily: 'Cairo',
      fontWeight: '700',
      stroke: '#000',
      strokeThickness: 3,
      borderRadius: 6,
    }).setOrigin(0.5).setInteractive();

    this.defendBtn = this.add.text(550, 500, 'دفاع', {
      fontSize: '32px',
      fill: '#fff',
      backgroundColor: '#228b22',
      padding: { x: 40, y: 20 },
      fontFamily: 'Cairo',
      fontWeight: '700',
      stroke: '#000',
      strokeThickness: 3,
      borderRadius: 6,
    }).setOrigin(0.5).setInteractive();

    this.attackBtn.on('pointerdown', () => this.playerAction('attack'));
    this.defendBtn.on('pointerdown', () => this.playerAction('defend'));
  }

  playerAction(action) {
    if (!this.playerTurn) return;
    this.playerTurn = false;

    const enemyAction = Phaser.Math.Between(0, 1) === 0 ? 'attack' : 'defend';

    if (action === 'attack' && enemyAction === 'defend') {
      // دفاع ناجح يقلل الضرر
      this.enemyHealth -= 10 + this.skills.horse * 2 - 5;
      this.infoText.setText('أنت هاجمت والخصم دافع! ضرر قليل.');
    } else if (action === 'attack' && enemyAction === 'attack') {
      this.enemyHealth -= 15 + this.skills.horse * 3;
      this.health -= 15;
      this.infoText.setText('هجوم متبادل! كلاكما أصيب.');
    } else if (action === 'defend' && enemyAction === 'attack') {
      this.health -= 10;
      this.infoText.setText('دافعت والخصم هاجم! ضرر قليل.');
    } else {
      this.infoText.setText('دفاع متبادل، لا ضرر.');
    }

    this.updateHealth();

    if (this.health <= 0) {
      this.scene.start('GameOverScene', { score: this.score });
      return;
    }

    if (this.enemyHealth <= 0) {
      this.score += 50;
      alert('فزت في مبارزة السيف! نقاط +50');
      this.scene.start('MarketScene', { health: this.health, score: this.score, skills: this.skills });
      return;
    }

    // دور الخصم (مبسط)
    this.time.delayedCall(1500, () => {
      this.playerTurn = true;
      this.infoText.setText('اختار هجومك أو دفاعك');
    });
  }

  updateHealth() {
    this.healthText.setText(`صحتك: ${this.health}`);
    this.enemyHealthText.setText(`صحة الخصم: ${this.enemyHealth}`);
  }
}

// مشهد النهاية الكبرى
class FinalChallengeScene extends Phaser.Scene {
  constructor() {
    super('FinalChallengeScene');
  }
  create(data) {
    this.health = data.health;
    this.score = data.score;
    this.skills = data.skills;

    this.add.rectangle(400, 300, 800, 600, 0x000033, 1);

    this.add.text(400, 80, 'التحدي النهائي: عرش سوق عكاظ', {
      fontSize: '38px',
      fill: '#ffd700',
      fontFamily: 'Cairo',
      fontWeight: '700',
    }).setOrigin(0.5);

    this.infoText = this.add.text(400, 300,
      'أنت الآن تواجه الحاكم القديم لسوق عكاظ.\nاختار أحد المهارات للمبارزة:',
      {
        fontSize: '28px',
        fill: '#fff',
        fontFamily: 'Cairo',
        align: 'center',
        wordWrap: { width: 700 }
      }).setOrigin(0.5);

    const choices = [
      { text: 'مبارزة فروسية', skill: 'horse' },
      { text: 'مبارزة بلاغة شعرية', skill: 'eloquence' },
      { text: 'مبارزة حكمة وفراسة', skill: 'wisdom' },
    ];

    choices.forEach((choice, i) => {
      const btn = this.add.text(400, 400 + i * 60, choice.text, {
        fontSize: '28px',
        fill: '#fff',
        backgroundColor: '#483d8b',
        padding: { x: 20, y: 10 },
        fontFamily: 'Cairo',
        fontWeight: '700',
        stroke: '#000',
        strokeThickness: 3,
        borderRadius: 7,
      }).setOrigin(0.5).setInteractive();

      btn.on('pointerdown', () => this.handleChoice(choice.skill));
    });
  }

  handleChoice(skill) {
    const playerSkillLevel = this.skills[skill];
    const difficulty = 3; // مستوى صعوبة التحدي

    if (playerSkillLevel >= difficulty) {
      // فوز اللاعب
      this.score += 100;
      alert('لقد انتصرت في التحدي النهائي! تهانينا!');
      this.scene.start('WinScene', { score: this.score });
    } else {
      // خسارة اللاعب
      this.health -= 50;
      if (this.health <= 0) {
        alert('لقد خسرت التحدي النهائي! انتهت اللعبة.');
        this.scene.start('GameOverScene', { score: this.score });
      } else {
        alert('مهارتك ليست كافية للفوز. حاول تدريب مهاراتك أكثر.');
        this.scene.start('MarketScene', { health: this.health, score: this.score, skills: this.skills });
      }
    }
  }
}

// مشهد انتهاء اللعبة بالخسارة
class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }
  create(data) {
    this.score = data.score || 0;

    this.add.rectangle(400, 300, 800, 600, 0x330000, 1);

    this.add.text(400, 250, 'انتهت اللعبة', {
      fontSize: '48px',
      fill: '#ff3333',
      fontFamily: 'Cairo',
      fontWeight: '700',
    }).setOrigin(0.5);

    this.add.text(400, 320, `نقاطك النهائية: ${this.score}`, {
      fontSize: '32px',
      fill: '#fff',
      fontFamily: 'Cairo',
    }).setOrigin(0.5);

    const retryBtn = this.add.text(400, 420, 'إعادة المحاولة', {
      fontSize: '32px',
      fill: '#fff',
      backgroundColor: '#8b0000',
      padding: { x: 30, y: 15 },
      fontFamily: 'Cairo',
      fontWeight: '700',
      stroke: '#000',
      strokeThickness: 3,
      borderRadius: 7,
    }).setOrigin(0.5).setInteractive();

    retryBtn.on('pointerdown', () => {
      this.scene.start('IntroScene');
    });
  }
}

// مشهد الفوز باللعبة
class WinScene extends Phaser.Scene {
  constructor() {
    super('WinScene');
  }
  create(data) {
    this.score = data.score || 0;

    this.add.rectangle(400, 300, 800, 600, 0x003300, 1);

    this.add.text(400, 250, 'مبروك! لقد ربحت اللعبة!', {
      fontSize: '48px',
      fill: '#00ff00',
      fontFamily: 'Cairo',
      fontWeight: '700',
    }).setOrigin(0.5);

    this.add.text(400, 320, `نقاطك النهائية: ${this.score}`, {
      fontSize: '32px',
      fill: '#fff',
      fontFamily: 'Cairo',
    }).setOrigin(0.5);

    const replayBtn = this.add.text(400, 420, 'اللعب مجدداً', {
      fontSize: '32px',
      fill: '#fff',
      backgroundColor: '#006400',
      padding: { x: 30, y: 15 },
      fontFamily: 'Cairo',
      fontWeight: '700',
      stroke: '#000',
      strokeThickness: 3,
      borderRadius: 7,
    }).setOrigin(0.5).setInteractive();

    replayBtn.on('pointerdown', () => {
      this.scene.start('IntroScene');
    });
  }
}

// إعداد اللعبة وتهيئة المشاهد
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  scene: [
    IntroScene,
    MarketScene,
    TrainSkillsScene,
    PoetryBattleScene,
    SwordBattleScene,
    FinalChallengeScene,
    GameOverScene,
    WinScene
  ]
};

const game = new Phaser.Game(config);
