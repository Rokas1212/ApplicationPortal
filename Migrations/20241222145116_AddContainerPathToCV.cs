using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApplicationPortal.Migrations
{
    /// <inheritdoc />
    public partial class AddContainerPathToCV : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ContainerPath",
                table: "Cvs",
                type: "character varying(512)",
                maxLength: 512,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContainerPath",
                table: "Cvs");
        }
    }
}
