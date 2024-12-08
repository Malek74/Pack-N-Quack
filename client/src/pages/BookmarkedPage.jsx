import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

export default function BookmarkedPage() {
    return (
        <Tabs defaultValue="places" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="places">Places</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>
            <TabsContent value="places">
                <Card>
                    <CardHeader>
                        <CardTitle>Bookmarked Places</CardTitle>
                        <CardDescription>
                            Add your description for bookmarked places here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Add your places content here */}
                    </CardContent>
                    <CardFooter>
                        {/* Add your places actions here */}
                    </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value="activities">
                <Card>
                    <CardHeader>
                        <CardTitle>Bookmarked Activities</CardTitle>
                        <CardDescription>
                            Add your description for bookmarked activities here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Add your activities content here */}
                    </CardContent>
                    <CardFooter>
                        {/* Add your activities actions here */}
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    )
}

