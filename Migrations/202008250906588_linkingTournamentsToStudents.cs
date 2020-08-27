namespace AngularJSMvc.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class linkingTournamentsToStudents : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Enrollment",
                c => new
                    {
                        EnrolledUserId = c.String(nullable: false, maxLength: 128),
                        EnrolledTournamentName = c.String(nullable: false, maxLength: 128),
                        placement = c.Int(nullable: false),
                        value = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.EnrolledUserId, t.EnrolledTournamentName });
            
            CreateTable(
                "dbo.Host",
                c => new
                    {
                        HostUserId = c.String(nullable: false, maxLength: 32),
                        TournamentName = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.HostUserId, t.TournamentName })
                .ForeignKey("dbo.User", t => t.HostUserId, cascadeDelete: true)
                .Index(t => t.HostUserId);
            
            CreateTable(
                "dbo.User",
                c => new
                    {
                        Email = c.String(nullable: false, maxLength: 32),
                        Password = c.String(nullable: false, maxLength: 20),
                    })
                .PrimaryKey(t => t.Email);
            
            CreateTable(
                "dbo.Tournament",
                c => new
                    {
                        HostEmail = c.String(nullable: false, maxLength: 32),
                        TournamentName = c.String(nullable: false, maxLength: 128),
                        RankField = c.String(nullable: false, maxLength: 32),
                    })
                .PrimaryKey(t => t.TournamentName)
                .ForeignKey("dbo.Host", t => new { t.HostEmail, t.TournamentName }, cascadeDelete: true)
                .Index(t => new { t.HostEmail, t.TournamentName });
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Tournament", new[] { "HostEmail", "TournamentName" }, "dbo.Host");
            DropForeignKey("dbo.Host", "HostUserId", "dbo.User");
            DropIndex("dbo.Tournament", new[] { "HostEmail", "TournamentName" });
            DropIndex("dbo.Host", new[] { "HostUserId" });
            DropTable("dbo.Tournament");
            DropTable("dbo.User");
            DropTable("dbo.Host");
            DropTable("dbo.Enrollment");
        }
    }
}
