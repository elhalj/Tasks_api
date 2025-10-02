import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Le nom d'utilisateur est requis"],
      trim: true,
      minlength: [
        3,
        "Le nom d'utilisateur doit contenir au moins 3 caractères",
      ],
      maxlength: [
        30,
        "Le nom d'utilisateur ne peut pas dépasser 30 caractères",
      ],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Veuillez fournir un email valide"],
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est requis"],
      minlength: [8, "Le mot de passe doit contenir au moins 8 caractères"],
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profile: {
      firstName: {
        type: String,
        trim: true,
      },
      lastName: {
        type: String,
        trim: true,
      },
      avatar: String,
      bio: {
        type: String,
        maxlength: [500, "La biographie ne peut pas dépasser 500 caractères"],
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
        validate: [
          validator.isMobilePhone,
          "Veuillez fournir un numéro de téléphone valide",
        ],
      },
    },
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        taskUpdates: { type: Boolean, default: true },
        mentions: { type: Boolean, default: true },
      },
      language: {
        type: String,
        default: "fr",
        enum: ["fr", "en", "es"],
      },
      theme: {
        type: String,
        default: "light",
        enum: ["light", "dark", "system"],
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    lastActiveAt: Date,
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        default: [],
      },
    ],
    collaborators: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    myTasks: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Task", default: [] },
    ],
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
    // Champs pour les statistiques et l'activité
    stats: {
      tasksCreated: { type: Number, default: 0 },
      tasksCompleted: { type: Number, default: 0 },
      commentsPosted: { type: Number, default: 0 },
      lastActiveRooms: [
        {
          room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
          lastVisited: { type: Date, default: Date.now },
        },
      ],
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: [],
    },
  },
  {
    timestamps: true
  }
);

// Index pour les recherches fréquentes
userSchema.index({
  "profile.firstName": "text",
  "profile.lastName": "text",
});

// Middleware pour hacher le mot de passe avant de sauvegarder
userSchema.pre("save", async function (next) {
  // Ne fonctionne que si le mot de passe a été modifié
  if (!this.isModified("password")) return next();

  // Hacher le mot de passe avec un coût de 12
  this.password = await bcrypt.hash(this.password, 12);

  // Ne pas mettre à jour passwordChangedAt pour les nouveaux utilisateurs
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000; // S'assurer que le jeton est créé après
  }

  next();
});

// Méthode pour vérifier si le mot de passe correspond
userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour vérifier si le mot de passe a été changé après l'émission du jeton
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // False signifie que le mot de passe n'a pas été changé
  return false;
};

// Méthode pour créer un jeton de réinitialisation de mot de passe
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Méthode virtuelle pour le nom complet
userSchema.virtual("fullName").get(function () {
  return (
    `${this.profile?.firstName || ""} ${this.profile?.lastName || ""}`.trim() ||
    this.userName
  );
});

const User = mongoose.model("User", userSchema);

export default User;
