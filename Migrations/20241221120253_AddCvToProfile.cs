using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApplicationPortal.Migrations
{
    /// <inheritdoc />
    public partial class AddCvToProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CvFileUrl",
                table: "AspNetUsers",
                type: "character varying(512)",
                maxLength: 512,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CvFileUrl",
                table: "AspNetUsers");
        }
    }
}
